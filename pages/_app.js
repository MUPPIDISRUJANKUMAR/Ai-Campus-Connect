import "../styles/globals.css";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { NotificationProvider } from "../src/contexts/NotificationContext";
import { ToastProvider } from "../src/contexts/ToastContext";
import { useEffect } from "react";
import { checkEnv, firebaseEnvVars } from "../src/lib/envCheck";

// During development, warn about missing env vars both on server and client.
if (process.env.NODE_ENV === "development") {
  checkEnv(firebaseEnvVars);
}

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      checkEnv(firebaseEnvVars);
    }
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
