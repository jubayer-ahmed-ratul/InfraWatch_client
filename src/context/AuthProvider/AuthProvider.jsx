import React, { useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  reload, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';
import useAxiosSecure from '../../hooks/useAxiosSecure'; 

const AuthProvider = ({ children }) => {
  // Initialize user from localStorage for instant role recognition
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure(); 

  // Sync Firebase user with backend database
  const syncUserWithDatabase = async (firebaseUser) => {
    try {
      const response = await axiosSecure.post('/users', {
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email,
        uid: firebaseUser.uid,
        photo: firebaseUser.photoURL || null
      });

      const dbUser = response.data;

      return {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        dbId: dbUser._id,
        role: dbUser.role || 'user',         // include role
        isPremium: dbUser.premium || false,
        premium: dbUser.premium || false,
        isBlocked: dbUser.blocked || false,
        blocked: dbUser.blocked || false
      };
    } catch (error) {
      console.error("Error syncing user with database:", error);
      return {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        role: 'user',
        isPremium: false,
        premium: false,
        isBlocked: false,
        blocked: false
      };
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const syncedUser = await syncUserWithDatabase(currentUser);
        setUser(syncedUser);
        localStorage.setItem('user', JSON.stringify(syncedUser));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update user safely and persist in localStorage
  const updateUser = (updates) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Auth functions
  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('profile');
  googleProvider.addScope('email');

  const googleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await reload(result.user);
    return result;
  };

  const logOut = () => {
    localStorage.removeItem('user');
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL
      });
    } else {
      return Promise.reject(new Error("No user logged in"));
    }
  };

  const authInfo = {
    user,
    loading,
    registerUser,
    signInUser,
    googleSignIn,
    logOut,
    updateUserProfile,
    updateUser,
    setUser
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
