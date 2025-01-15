import "@/styles/globals.css";
import type { AppProps } from "next/app";
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "../context/themeContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const user = { role: 'superAdmin' }; // Todo : Add logic to get User role

  const handleLogout = () => {
    setIsLoggedIn(false); 
    localStorage.removeItem("authToken"); 
    router.push("/login"); 
  };

  useEffect(() => {
    // const token = localStorage.getItem("authToken");
    // setIsLoggedIn(!!token); 
    setIsLoggedIn(true);
  }, []);
  
  return (
    <ThemeProvider>
      <Layout 
        pageTitle={pageProps?.pageTitle || "Rakshak"} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        user={user}
      >
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
