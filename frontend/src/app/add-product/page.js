'use client'; import React, { useContext } from 'react';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../lib/SidebarContext';
import { MenuContext } from '../lib/MenuContext';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useSharedStyles } from '../sharedStyles';

const AddProductPage = () => {
  
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

            {/* Add Product Form */}
            <div style={styles.form}>
            <div style={styles.formRow}>
                <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Name*</label>
                    <input type="text" style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea style={styles.textarea} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Category*</label>
                    <select style={styles.select}>
                    <option>T-Shirt</option>
                    <option>Tops</option>
                    <option>Outwear</option>
                    <option>Accessories</option>
                    <option>Bottoms</option>
                    <option>Dresses</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Price*</label>
                    <input type="number" style={styles.input} />
                </div>
                </div>
                <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Item code*</label>
                    <input type="text" style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Stock size*</label>
                    <input type="number" style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Stores availability*</label>
                    <select style={styles.select}>
                    <option>Store 1</option>
                    <option>Store 2</option>
                    <option>Store 3</option>
                    <option>Store 4</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Product photos*</label>
                    <input type="file" style={styles.input} />
                </div>
                </div>
            </div>
            <div style={styles.formActions}>
                <button style={styles.saveButton}>
                <FaPlus style={styles.saveIcon} /> Save Product
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     fontFamily: 'Inter, sans-serif',
//     backgroundColor: '#f5f6fa', // Light gray background
//     minHeight: '100vh',
//   },
//   header: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffffff', // White header
//     padding: '16px 24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//     zIndex: 1000,
//   },
//   headerLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '24px',
//   },
//   logo: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#6A3CBC', // Purple logo
//   },
//   searchBar: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#f5f6fa',
//     borderRadius: '8px',
//     padding: '8px 12px',
//     width: '300px',
//     border: '1px solid #6A3CBC', // Purple border
//   },
//   searchIcon: {
//     color: '#6A3CBC', // Purple icon
//     marginRight: '8px',
//   },
//   searchInput: {
//     border: 'none',
//     outline: 'none',
//     backgroundColor: 'transparent',
//     fontSize: '14px',
//     color: '#6A3CBC', // Purple text
//     width: '100%',
//   },
//   headerRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//   },
//   icon: {
//     color: '#6A3CBC', // Purple icons
//     fontSize: '20px',
//     cursor: 'pointer',
//   },
//   mainContent: {
//     display: 'flex',
//     marginTop: '80px',
//   },
//   sidebar: {
//     position: 'fixed',
//     top: '80px',
//     left: 0,
//     width: '250px',
//     height: 'calc(100vh - 80px)',
//     backgroundColor: '#8253D7', // Purple sidebar
//     padding: '24px',
//     boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     borderRadius: '0 12px 12px 0', // Rounded corners on the right side
//   },
//   sidebarTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#ffffff', // White text
//     marginBottom: '24px',
//   },
//   sidebarList: {
//     listStyle: 'none',
//     padding: '0',
//   },
//   sidebarItem: {
//     fontSize: '14px',
//     color: '#ffffff', // White text
//     marginBottom: '16px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '8px',
//     borderRadius: '8px',
//     transition: 'background-color 0.3s',
//   },
//   sidebarItemHover: {
//     backgroundColor: '#461B93', // Dark purple on hover
//   },
//   menuIcon: {
//     color: '#ffffff', // White icons
//     fontSize: '16px',
//   },
//   sidebarFooter: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '12px',
//   },
//   textButton: {
//     backgroundColor: 'transparent',
//     border: 'none',
//     color: '#ffffff', // White text
//     fontSize: '14px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '8px 0',
//   },
//   content: {
//     marginLeft: '250px',
//     padding: '24px',
//     width: 'calc(100% - 250px)',
//     overflowY: 'auto',
//     height: 'calc(100vh - 80px)',
//     backgroundColor: '#ffffff', // White background
//   },
//   pageTitle: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '24px',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   formRow: {
//     display: 'flex',
//     gap: '24px',
//   },
//   formColumn: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   formGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   },
//   label: {
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//   },
//   input: {
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC', // Purple border
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     outline: 'none',
//   },
//   textarea: {
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC', // Purple border
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     outline: 'none',
//     resize: 'vertical',
//   },
//   select: {
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC', // Purple border
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     outline: 'none',
//   },
//   formActions: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   saveButton: {
//     display: 'flex',
//     padding: '12px 24px',
//     backgroundColor: '#461B93', // Dark purple background
//     color: '#ffffff', // White text
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//   },
//   saveIcon: {
//     marginRight: '8px',
//   },
// };


export default AddProductPage;