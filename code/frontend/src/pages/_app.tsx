import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../context/themeContext";
import { UserProvider, useUser } from "../context/userContext";
import axios from "axios";
import { WeaponAlertProvider } from "../context/WeaponAlertContext";

function AppContent({ Component, pageProps, router }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout", {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        setUser(null);
        router.push("/login");
      } else {
        console.error("Failed to log out:", response);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  return (
    <Layout
      pageTitle={pageProps?.pageTitle || "Rakshak"}
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
    >
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App(appProps: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <WeaponAlertProvider>
            <AppContent {...appProps} />
          </WeaponAlertProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
