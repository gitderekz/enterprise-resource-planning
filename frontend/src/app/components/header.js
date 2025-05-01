"use client"
import React, { useContext, useState, useEffect, useRef } from 'react';
import { logout } from '../lib/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../lib/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
  FaArrowRight
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../lib/SidebarContext';
import { MenuContext } from '../lib/MenuContext';

export default function Header() {
  const { theme, toggleTheme, colors } = useContext(ThemeContext);
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication state from Redux
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(null);
  const popupRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  const handleLogout = () => {
    dispatch(logout()); // Uncomment if using Redux for logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  const headerStyles = {
    ...styles.header,
    backgroundColor: colors[theme].background,
    color: colors[theme].text,
    boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  
  // Show immediately when toggled
  useEffect(() => {
    if (showPopup) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsMounted(true)); // triggers transition after DOM paint
    } else {
      setIsMounted(false); // triggers slide-out
      const timeout = setTimeout(() => setShouldRender(false), 300); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);
  // Close popup on outside click, excluding the toggle button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div style={headerStyles}>
      <div style={styles.headerLeft}>
        <div style={{ ...styles.logo, color: colors[theme].primary }}>enrep.sys</div>
      </div>

      <div style={styles.headerCenter}>
        <div style={{ 
          ...styles.searchBar, 
          backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f6fa',
          borderColor: colors[theme].primary
        }}>
          <FaSearch style={{ ...styles.searchIcon, color: colors[theme].primary }} />
          <input
            type="text"
            placeholder="Search..."
            style={{ 
              ...styles.searchInput,
              color: colors[theme].text,
              backgroundColor: 'transparent'
            }}
          />
        </div>
      </div>
      <div style={styles.headerRight}>
        <button onClick={toggleTheme} style={styles.themeToggle}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <FaCommentDots style={{ ...styles.icon, color: colors[theme].primary }} />
        <FaBell style={{ ...styles.icon, color: colors[theme].primary }} />
        <FaCog 
          style={{ ...styles.icon, color: colors[theme].primary }} 
          onClick={() => router.push('/settings')}
        />
        <center style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: colors[theme].text, fontSize: '16px' }}>
            {user?.username}
          </span>
          <FaUserCircle
            ref={toggleRef}
            onClick={() => setShowPopup((prev) => !prev)}
            style={{ ...styles.icon, color: colors[theme].primary, cursor: 'pointer' }}
          />
        </center>
        {shouldRender && (
          <div 
          ref={popupRef} 
          style={{ 
            ...styles.popup,
            ...(isMounted ? styles.popupVisible : {}),
            backgroundColor: colors[theme].cardBg,
            boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}>
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => { router.push('/profile'); setShowPopup(false); }} 
                  style={{ ...styles.popupItem, color: colors[theme].text }}
                >
                  Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  style={{ ...styles.popupItem, color: colors[theme].text }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => { router.push('/login'); setShowPopup(false); }} 
                style={{ ...styles.popupItem, color: colors[theme].text }}
              >
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
    flex: 1, // takes up equal space
  },
  headerCenter: {
    flex: 2, // makes it wider
    display: 'flex',
    justifyContent: 'center',
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
    flex: 1,
    justifyContent: 'flex-end',
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
    transform: 'translateX(20px)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'transform 300ms ease, opacity 300ms ease',
  },
  popupVisible: {
    transform: 'translateX(0)',
    opacity: 1,
    pointerEvents: 'auto',
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
