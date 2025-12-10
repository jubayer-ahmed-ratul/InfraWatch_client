import React, { useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  reload
} from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

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
        return signOut(auth);
    };

    const authInfo = { 
        user, 
        loading, 
        registerUser, 
        signInUser, 
        googleSignIn, 
        logOut 
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
