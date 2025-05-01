'use client'; 
import React, { useState, useContext } from 'react';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
  FaCheck
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../lib/SidebarContext';
import { MenuContext } from '../lib/MenuContext';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useSharedStyles } from '../sharedStyles';
import { useTheme } from '../lib/ThemeContext';  // Import the hook

const SettingsPage = () => {
  const [roles, setRoles] = useState({
    manager: true,
    editor: false,
    supplier: false,
    seller: false,
    admin: false,
    finance: false
  });

  const handleRoleChange = (role) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [role]: !prevRoles[role]
    }));
  };
  
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
          <h1 style={styles.pageTitle}>Settings</h1>

          {/* Personal Info */}
          <div style={styles.personalInfo}>
            <div style={styles.personalInfoColumn}>
              <div style={styles.infoGroup}>
                <label style={styles.label}>Name*</label>
                <input type="text" value="John Hopkins" style={styles.input} readOnly />
              </div>
              <div style={styles.infoGroup}>
                <label style={styles.label}>Company email*</label>
                <input type="email" value="j.hopkins@enrep.sys" style={styles.input} readOnly />
              </div>
            </div>
            <div style={styles.personalInfoColumn}>
              <div style={styles.infoGroup}>
                <label style={styles.label}>Store</label>
                <input type="text" value="Leicester, UK" style={styles.input} readOnly />
              </div>
              <div style={styles.infoGroup}>
                <label style={styles.label}>Store ID</label>
                <input type="text" value="94-K-6764-LEI" style={styles.input} readOnly />
              </div>
              <div style={styles.infoGroup}>
                <label style={styles.label}>Role</label>
                <input type="text" value="Manager" style={styles.input} readOnly />
              </div>
            </div>
          </div>

          {/* Role and Permissions */}
          <div style={styles.rolePermissions}>
            <div style={styles.roleSection}>
              <h2 style={styles.sectionTitle}>Role</h2>
              <div style={styles.roleOptions}>
                <label style={styles.roleOption}>
                  <input type="checkbox" checked={roles.manager} onChange={() => handleRoleChange('manager')} /> Manager
                </label>
                <label style={styles.roleOption}>
                  <input type="checkbox" checked={roles.editor} onChange={() => handleRoleChange('editor')}/> Editor
                </label>
                <label style={styles.roleOption}>
                  <input type="checkbox" checked={roles.supplier} onChange={() => handleRoleChange('supplier')} /> Supplier
                </label>
                <label style={styles.roleOption}>
                  <input type="checkbox" checked={roles.seller} onChange={() => handleRoleChange('seller')} /> Seller
                </label>
                <label style={styles.roleOption}>
                  <input type="checkbox" /> Admin
                </label>
                <label style={styles.roleOption}>
                  <input type="checkbox" checked={roles.finance} onChange={() => handleRoleChange('finance')} /> Finance
                </label>
              </div>
            </div>
            <div style={styles.permissionsSection}>
              <h2 style={styles.sectionTitle}>Permissions</h2>
              <div style={styles.permissionsTable}>
                <div style={styles.tableHeader}>
                  <div style={styles.tableHeaderCell}></div>
                  <div style={styles.tableHeaderCell}></div>
                  <div style={styles.tableHeaderCell}>View</div>
                  <div style={styles.tableHeaderCell}>Edit</div>
                  <div style={styles.tableHeaderCell}>Create</div>
                  <div style={styles.tableHeaderCell}>Approval</div>
                </div>
                <div style={styles.tableRow}>
                  <div style={styles.tableCell}>Customer</div>
                  <div style={styles.tableCell}><FaCheck /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                </div>
                <div style={styles.tableRow}>
                  <div style={styles.tableCell}>Product</div>
                  <div style={styles.tableCell}><FaCheck /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                </div>
                <div style={styles.tableRow}>
                  <div style={styles.tableCell}>User</div>
                  <div style={styles.tableCell}><FaCheck /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                </div>
                <div style={styles.tableRow}>
                  <div style={styles.tableCell}>Supplier</div>
                  <div style={styles.tableCell}><FaCheck /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                </div>
                <div style={styles.tableRow}>
                  <div style={styles.tableCell}>Store</div>
                  <div style={styles.tableCell}><FaCheck /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                </div>
                <div style={styles.tableRow}>
                  <div style={styles.tableCell}>Billing</div>
                  <div style={styles.tableCell}><FaCheck /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                  <div style={styles.tableCell}><input type="checkbox" /></div>
                </div>
              </div>
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
// //   },
//   personalInfo: {
//     display: 'flex',
//     gap: '24px',
//     marginBottom: '24px',
//   },
//   personalInfoColumn: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   infoGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   },
//   label: {
//     fontSize: '14px',
//     color: '#636e72', // Medium gray text
//   },
//   input: {
//     padding: '8px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC', // Purple border
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     outline: 'none',
//     backgroundColor: '#f5f6fa', // Light gray background
//   },
//   rolePermissions: {
//     display: 'flex',
//     gap: '24px',
//   },
//   roleSection: {
//     flex: 1,
//     backgroundColor: '#f5f6fa', // Light gray background
//     borderRadius: '8px',
//     padding: '24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   sectionTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//     marginBottom: '16px',
//   },
//   roleOptions: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   },
//   roleOption: {
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//   },
//   permissionsSection: {
//     flex: 2,
//     backgroundColor: '#f5f6fa', // Light gray background
//     borderRadius: '8px',
//     padding: '24px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   permissionsTable: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   },
//   tableHeader: {
//     display: 'flex',
//     backgroundColor: '#ffffff', // White background
//     padding: '8px 16px',
//     borderRadius: '8px',
//   },
//   tableHeaderCell: {
//     flex: 1,
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#2d3436', // Dark gray text
//   },
//   tableRow: {
//     display: 'flex',
//     padding: '8px 16px',
//     backgroundColor: '#ffffff', // White background
//     borderRadius: '8px',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: '14px',
//     color: '#2d3436', // Dark gray text
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   },
// };

export default SettingsPage;
