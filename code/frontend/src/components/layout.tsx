import Head from "next/head";
import Container  from "react-bootstrap/Container";
import AppNavbar from "./navbar";
import { useTheme } from "../context/themeContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "./sidebar";
import { LayoutProps } from "../types";
import { useUser } from "../context/userContext";

const Layout = ({ children, pageTitle, isLoggedIn, onLogout }: LayoutProps) => {
  const { isDarkMode } = useTheme();
  const routesWithoutSidebar = ['/login', '/signup', '/about-us','contact-us', '/forgot-password'];
  const router = useRouter();
  const { user } = useUser();
  const shouldShowSidebar = user && !routesWithoutSidebar.includes(router.pathname);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <AppNavbar isLoggedIn={isLoggedIn} onLogout={onLogout}/>
      {shouldShowSidebar && <Sidebar user={user} />}

      <Container className="py-4">{children}</Container>
    </>
  );
};

export default Layout;