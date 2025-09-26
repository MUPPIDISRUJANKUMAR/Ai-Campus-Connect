// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as AppUser, UserRole } from "../types"; // keep your types
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    userData: Partial<AppUser> & { email: string; password: string }
  ) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Helper: fetch user profile from Firestore
 */
const fetchUserProfile = async (uid: string): Promise<AppUser | null> => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as AppUser;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {
        try {
          if (fbUser) {
            const profile = await fetchUserProfile(fbUser.uid);
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth listener error:", err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // register: create user in Firebase Auth and create profile doc in Firestore
  const register = async (
    userData: Partial<AppUser> & { email: string; password: string }
  ) => {
    const { email, password, name = "", ...rest } = userData;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // update display name in Firebase Auth
    if (name) {
      try {
        await updateProfile(cred.user, { displayName: name });
      } catch (err) {
        console.warn("updateProfile failed", err); // non-fatal
      }
    }

    const profile: AppUser = {
      id: uid,
      name,
      email,
      role: (userData.role as UserRole) || "student",
      verified: cred.user.emailVerified,
      skills: [],
      interests: [],
      ...rest,
    };

    await setDoc(doc(db, "users", uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });

    // onAuthStateChanged will handle setting the user state
    // but we can optimistically set it here for faster UI updates
    setUser(profile);
  };

  // login: sign in with email + password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handler will set user after sign in
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const switchRole = async (role: UserRole) => {
    if (!user) throw new Error("Not authenticated");
    const ref = doc(db, "users", user.id);
    await updateDoc(ref, { role });
    setUser({ ...user, role });
  };

  const updateUserProfile = async (data: Partial<AppUser>) => {
    if (!user) throw new Error("Not authenticated");
    const ref = doc(db, "users", user.id);
    await updateDoc(ref, data);
    setUser({ ...user, ...data });
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        switchRole,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
