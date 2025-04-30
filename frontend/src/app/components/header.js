import React, { useContext, useState } from 'react';
import { logout } from '../lib/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../lib/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
  FaArrowRight
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { MenuContext } from '../lib/MenuContext';

export default function Header() {
  const { theme, toggleTheme, colors } = useContext(ThemeContext);
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication state from Redux
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout()); // Uncomment if using Redux for logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    // <nav className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
    //   <button onClick={toggleTheme}>
    //     {theme === 'light' ? '🌙' : '☀️'}
    //   </button>
    // </nav>

    <div style={styles.header}>
      {/* Left Side: Logo and Search Bar */}
      <div style={styles.headerLeft}>
        <div style={styles.logo}>inventor.io</div>
        <div style={styles.searchBar}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
          />
        </div>
      </div>
      {/* Right Side: Icons */}
      <div style={styles.headerRight}>
        <div className="flex justify-between items-center">
          <span className="text-xl">{theme}</span>
          <button onClick={toggleTheme} className="text-xl">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <FaCommentDots style={styles.icon} />
        <FaBell style={styles.icon} />
        <FaCog style={styles.icon} onClick={() => router.push('/settings')}/>
        <FaUserCircle
          onClick={() => setShowPopup((prev) => !prev)}
          style={{ ...styles.icon, cursor: 'pointer' }}
        />
        {showPopup && (
          <div style={styles.popup}>
            {isAuthenticated ? (
              <>
                <button onClick={() => { router.push('/profile'); setShowPopup(false); }} style={styles.popupItem}>
                  Profile
                </button>
                <button onClick={handleLogout} style={styles.popupItem}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { router.push('/login'); setShowPopup(false); }} style={styles.popupItem}>
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#f5f6fa', // Light gray background
    minHeight: '100vh',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#ffffff', // White header
    padding: '16px 24px',
    // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    // zIndex: 1000,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#6A3CBC', // Purple logo
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: '8px',
    padding: '8px 12px',
    width: '300px',
    border: '1px solid #6A3CBC', // Purple border
  },
  searchIcon: {
    color: '#6A3CBC', // Purple icon
    marginRight: '8px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#6A3CBC', // Purple text
    width: '100%',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  icon: {
    color: '#6A3CBC', // Purple icons
    fontSize: '20px',
    cursor: 'pointer',
  },
  popup: {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    borderRadius: '8px',
    zIndex: 100,
    minWidth: '120px',
    padding: '8px 0',
  },
  popupItem: {
    display: 'block',
    padding: '10px 16px',
    width: '100%',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#2d3436',
  },
  mainContent: {
    display: 'flex',
    marginTop: '80px',
  },
  sidebar: {
    position: 'fixed',
    top: '80px',
    left: 0,
    width: '250px',
    height: 'calc(100vh - 80px)',
    backgroundColor: '#8253D7', // Purple sidebar
    padding: '24px',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '0 12px 12px 0', // Rounded corners on the right side
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff', // White text
    marginBottom: '24px',
  },
  sidebarList: {
    listStyle: 'none',
    padding: '0',
  },
  sidebarItem: {
    fontSize: '14px',
    color: '#ffffff', // White text
    marginBottom: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  },
  sidebarItemHover: {
    backgroundColor: '#461B93', // Dark purple on hover
  },
  menuIcon: {
    color: '#ffffff', // White icons
    fontSize: '16px',
  },
  sidebarFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  textButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff', // White text
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
  },
  content: {
    marginLeft: '250px',
    padding: '24px',
    width: 'calc(100% - 250px)',
    overflowY: 'auto',
    height: 'calc(100vh - 80px)',
  },
  topSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  cardScrollContainer: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    textAlign: 'center',
  },
  cardNumber: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#461B93',
  },
  cardUnit: {
    fontSize: '14px',
    color: '#8253D7',
    margin: '8px 0',
  },
  cardTitle: {
    fontSize: '16px',
    color: '#2d3436',
  },
  scrollArrow: {
    backgroundColor: '#D4ADFC',
    borderRadius: '50%',
    padding: '12px',
    cursor: 'pointer',
  },
  arrowIcon: {
    color: '#ffffff',
    fontSize: '20px',
  },
  bottomSection: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  bottomRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
  },
  bottomCard: {
    backgroundColor: '#f5f6fa',
    borderRadius: '8px',
    padding: '16px',
    flex: 1,
  },
  bottomCardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: '16px',
  },
  chartContainer: {
    height: '200px',
  },
  smallCardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  smallCard: {
    backgroundColor: '#D4ADFC',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
  },
  smallCardIcon: {
    color: '#ffffff',
    fontSize: '24px',
  },
  smallCardText: {
    fontSize: '14px',
    color: '#ffffff',
    marginTop: '8px',
  },
  stockList: {
    listStyle: 'none',
    padding: '0',
  },
  storeList: {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(3, 1fr)',
    // gap: '16px',
    // display: 'flex', // Use flexbox for horizontal layout
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '16px', // Space between items
    overflowX: 'auto', // Allow horizontal scrolling if needed
  },
  storeItem: {
    // fontSize: '14px',
    // color: '#2d3436',
    display: 'flex', // Use flexbox for horizontal layout
    gap: '16px', // Space between columns
    padding: '12px',
    backgroundColor: '#f5f6fa', // Light gray background
    borderRadius: '8px', // Rounded corners
    // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
    minWidth: '300px', // Minimum width for each item
  },
};
