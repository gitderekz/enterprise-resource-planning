'use client'; 
import React, { useContext } from 'react';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';

const cisPage = () => {
  
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  // Find the matching menu item
  const currentMenuItem = menuItems.find(item => item.link === pathname);
  const pageTitle = currentMenuItem?.link || currentMenuItem?.menu_item || 'Untitled Page';

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar />

        {/* Scrollable Content */}
        {/* <div style={styles.content}> */}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
            <h1 style={styles.pageTitle}>{pageTitle}</h1>

            {/* TODO */}

        </div>
      </div>
    </div>
  );
};

export default cisPage;