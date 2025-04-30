'use client'; // Mark as a Client Component
import { useState, useContext, useEffect } from 'react';
import { MenuContext } from '../lib/MenuContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { 
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt, 
  FaArrowRight 
} from 'react-icons/fa'; // Icons from react-icons
import * as FaIcons from 'react-icons/fa';

export default function Sidebar() {
  const { menuItems } = useContext(MenuContext);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(true); // New state to control sidebar visibility
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null); // Added for hover effect on child menu items

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState); // Toggle sidebar visibility
  };

  const toggleMenu = (id) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id]
    );
  };

  return (
    <div style={styles.sidebar}>
      <ul style={styles.sidebarList}>
        {menuItems
          .filter(item =>
            (item.role_id === 0 || (user && item.role_id === user.role_id)) &&
            item.menu_item !== 'Add Product' &&
            item.menu_item !== 'Log out'
          )
          .filter(item => item.parent_id === null)
          .map(parent => {
            const IconComponent = FaIcons[parent.icon] || FaIcons.FaQuestionCircle;
            const children = menuItems.filter(child => parseInt(child.parent_id) === parseInt(parent.id));
            const showNestedMenus = user?.role_id === 1 || user?.role_id === 2; // Check if the user can see nested menus
            const isExpanded = expandedMenus.includes(parent.id);

            return (
              <li key={parent.id}>
                <div
                  style={{ ...styles.sidebarItem, cursor: children.length > 0 ? 'pointer' : 'default' }}
                  onClick={() => {
                    if (children.length > 0 && showNestedMenus) {
                      toggleMenu(parent.id); // Toggle expanded state for nested menus
                    } else if (parent.link) {
                      router.push(parent.link);
                    }
                  }}
                >
                  <IconComponent style={styles.menuIcon} />
                  {parent.menu_item}
                  {children.length > 0 && showNestedMenus && (
                    <span style={{ marginLeft: 'auto' }}>{isExpanded ? '▾' : '▸'}</span>
                  )}
                </div>

                {isExpanded && showNestedMenus && children.length > 0 && (
                  <ul style={styles.childMenuList}>
                    {children
                      .filter(child => parseInt(child.role_id) === 0 || parseInt(child.role_id) === parseInt(user.role_id))
                      .map(child => {
                        const ChildIcon = FaIcons[child.icon] || FaIcons.FaQuestionCircle;
                        return (
                          <li
                            key={child.id}
                            style={{
                              ...styles.childMenuItem,
                              ...(hoveredItem === child.id ? styles.childMenuItemHover : {})
                            }}
                            onClick={() => child.link && router.push(child.link)}
                            onMouseEnter={() => setHoveredItem(child.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <ChildIcon style={styles.childIcon} /> {child.menu_item}
                          </li>
                        );
                      })}
                  </ul>
                )}
              </li>
            );
          })}
      </ul>

      <div style={styles.sidebarFooter}>
        {/* 'Add Product' button outside of the ul */}
        <button style={styles.textButton} onClick={() => router.push('/add-product')}>
          <FaPlus style={styles.menuIcon} /> Add product
        </button>

        {/* 'Log out' button outside of the ul */}
        <button
          style={styles.textButton}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
        >
          <FaSignOutAlt style={styles.menuIcon} /> Log out
        </button>
      </div>
    </div>
  );
}

const styles = {
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
  childMenuList: {
    listStyle: 'none',
    paddingLeft: '24px',
    marginTop: '4px',
  },
  childMenuItem: {
    cursor: 'pointer',
    padding: '6px 12px',
    marginLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#D4ADFC', // Lighter purple for sub-items
    fontSize: '13px',
    borderRadius: '6px',
    transition: 'all 0.3s',
  },
  childMenuItemHover: {
    backgroundColor: '#6A3CBC',
    color: '#ffffff',
  },
  childIcon: {
    marginRight: '8px',
    fontSize: '14px',
    color: '#D4ADFC',
  },
};
