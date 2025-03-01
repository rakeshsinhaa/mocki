import { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error("Auth persistence error:", error);
      }

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.emailVerified) {
        return { error: "Please verify your email before logging in." };
      }
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { error: getFirebaseErrorMessage(error.code) };
    }
  };

  const emailSignUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { error: getFirebaseErrorMessage(error.code) };
    }
  };

  const emailSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        return { error: "Please verify your email before logging in." };
      }
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      return { error: getFirebaseErrorMessage(error.code) };
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      return { error: getFirebaseErrorMessage(error.code) };
    }
  };

  const updateUserProfile = async (name, photoURL) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name, photoURL });
        setUser({ ...auth.currentUser, displayName: name, photoURL });
        return { success: true };
      }
      return { error: "No user logged in." };
    } catch (error) {
      return { error: getFirebaseErrorMessage(error.code) };
    }
  };

  const getFirebaseErrorMessage = (code) => {
    const errorMessages = {
      "auth/invalid-email": "Invalid email format.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/email-already-in-use": "Email is already in use. Try logging in.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/network-request-failed": "Network error. Please check your connection.",
    };
    return errorMessages[code] || "Authentication failed. Please try again.";
  };

  return (
    <AuthContext.Provider 
      value={{ user, loading, googleSignIn, emailSignUp, emailSignIn, logOut, updateUserProfile }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
