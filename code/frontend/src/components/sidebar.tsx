import {useEffect, useState } from 'react';
import { Button, Nav, Offcanvas } from 'react-bootstrap';
import { GoSidebarCollapse } from 'react-icons/go';
import { useTheme } from '../context/themeContext';
import { IconContext } from "react-icons";
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user:{
    role: Role | null;
  }
}
type SidebarItem = "divider" | { href: string; label: string };
type Role = 'user' | 'siteAdmin' | 'superAdmin';

const Sidebar = ({ user } : SidebarProps ) => {
  const { isDarkMode } = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const pathname = usePathname(); 

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const styles = {
    offcanvas: {
      top: `${navbarHeight}px`,
      height: `calc(100% - ${navbarHeight}px)`,
    },
    navLink: {
      color: isDarkMode ? "#f8f9fa" : "#212529",
      textDecoration: "none", 
    },
    navLinkActive: {
      color: isDarkMode ? "#f8f9fa" : "#212529",
      fontWeight: "bold", 
    },
    hr: {
      border: "0",
      borderTop: `1px solid ${isDarkMode ? "#495057" : "#ced4da"}`, 
      margin: "0.5rem 0",
    },
  };

  const sidebarConfig : Record<Role, ({ href: string; label: string } | 'divider')[]> = {
    user: [
      { href: "/currentAlerts", label: "Current Alerts" },
      { href: "/cctvFeeds", label: "View CCTVs" },
    ],
    siteAdmin: [
      { href: "/currentAlerts", label: "Current Alerts" },
      { href: "/alertHistory", label: "View Alert History" },
      "divider",
      { href: "/cctvFeeds", label: "View CCTV Feeds" },
      { href: "/manageCCTVs", label: "Manage CCTVs" },
      "divider",
      { href: "/manageUsers", label: "Manage Users" },
    ],
    superAdmin: [
      { href: "/currentAlerts", label: "Current Alerts" },
      { href: "/alertHistory", label: "View Alert History" },
      "divider",
      { href: "/cctvFeeds", label: "View CCTV Feeds" },
      { href: "/manageCCTVs", label: "Manage CCTVs" },
      "divider",
      { href: "/manageUsers", label: "Manage Users" },
      { href: "/manageInstitutions", label: "Manage Institutes" },
    ],
  };
  
  const renderSidebarItems = () => {
    const role: Role = (user?.role as Role) || 'user';
    const items = sidebarConfig[role];
    return (
      <>
        {items.map((item: SidebarItem, index: number) =>
          item === "divider" ? (
            <hr key={`divider-${index}`} style={styles.hr} />
          ) : (
            <Nav.Link
              key={item.href}
              href={item.href}
              style={pathname === item.href ? styles.navLinkActive : styles.navLink}
            >
              {item.label}
            </Nav.Link>
          )
        )}
      </>
    );
  };

  return (
    <>
        <IconContext.Provider value={{ color: isDarkMode ? "blue" : "black" }}>
            <Button
                variant="link"
                onClick={toggleSidebar}
                className="ms-2 my-2 text-dark d-block"
                aria-label="Toggle Sidebar"
            >
                <GoSidebarCollapse size={25} />
            </Button>
        </IconContext.Provider>
        <Offcanvas
            show={showSidebar}
            onHide={toggleSidebar}
            placement="start"
            className={`d-block ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
            style={styles.offcanvas} 
        >
            <Offcanvas.Header closeButton closeVariant={isDarkMode ? 'white' : 'dark'}>
                <Offcanvas.Title className='ms-3'>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
                <Nav defaultActiveKey="/" className="flex-column">
                    {renderSidebarItems()}
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    </>
  );
};

export default Sidebar;
