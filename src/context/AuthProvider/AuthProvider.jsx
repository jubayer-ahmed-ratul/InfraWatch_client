
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure(); 


  const syncUserWithDatabase = async (firebaseUser) => {
    try {
    
      const dbUserResponse = await axiosSecure.post('/users', {
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email,
        uid: firebaseUser.uid,
        photo: firebaseUser.photoURL || null
      });

      const dbUser = dbUserResponse.data;
      
     
      return {
        ...firebaseUser,
        isPremium: dbUser.premium || dbUser.isPremium || false,
        isBlocked: dbUser.blocked || dbUser.isBlocked || false,
        dbId: dbUser._id,
        premium: dbUser.premium || false,
        blocked: dbUser.blocked || false
      };
    } catch (error) {
      console.error("Error syncing user with database:", error);
      return {
        ...firebaseUser,
        isPremium: false,
        isBlocked: false,
        premium: false,
        blocked: false
      };
    }
  };

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

 
  const updateUser = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));
    
 
    if (user) {
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...updates
      }));
    }
  };

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