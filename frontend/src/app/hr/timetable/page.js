'use client'; 
import React, { useContext } from 'react';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { MenuContext } from '../../lib/MenuContext';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { useSharedStyles } from '../../sharedStyles';

const timetablePage = () => {
  
  const styles = useSharedStyles();
  const pathname = usePathname();
  const { menuItems } = useContext(MenuContext);

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
        <div style={styles.content}>
            <h1 style={styles.pageTitle}>{pageTitle}</h1>

            {/* TODO */}

        </div>
      </div>
    </div>
  );
};

export default timetablePage;