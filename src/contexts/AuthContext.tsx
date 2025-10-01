import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as AppUser, UserRole } from "../types";
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
} from "firebase/firestore";

type Theme = "light" | "dark";

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
  theme: Theme;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserProfile = async (uid: string): Promise<AppUser | null> => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as AppUser;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {
        try {
          if (fbUser) {
            const profile = await fetchUserProfile(fbUser.uid);
            setUser(profile);
            if (profile?.theme) {
              setTheme(profile.theme);
            } else {
              const savedTheme = localStorage.getItem("theme") as Theme;
              if (savedTheme) {
                setTheme(savedTheme);
              } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setTheme("dark");
              }
            }
          } else {
            setUser(null);
            const savedTheme = localStorage.getItem("theme") as Theme;
            if (savedTheme) {
              setTheme(savedTheme);
            }
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

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (user) {
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, { theme: newTheme });
      } catch (error) {
        console.error("Failed to update theme in Firestore:", error);
      }
    }
  };

  const register = async (
    userData: Partial<AppUser> & { email: string; password: string }
  ) => {
    const { email, password, name = "", ...rest } = userData;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    if (name) {
      try {
        await updateProfile(cred.user, { displayName: name });
      } catch (err) {
        console.warn("updateProfile failed", err);
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
      theme: theme, // Set default theme on registration
      ...rest,
    };

    await setDoc(doc(db, "users", uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });

    setUser(profile);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
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
        theme,
        toggleTheme,
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

