'use client';
import { useState, useContext, useEffect } from 'react';
import { MenuContext } from '../lib/MenuContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../lib/SidebarContext';
import { useSelector } from 'react-redux';
import { useTheme } from '../lib/ThemeContext';
import { useSharedStyles } from '../sharedStyles';
import { 
  FaPlus, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

export default function Sidebar() {
  const { isSidebarVisible, setIsSidebarVisible, toggleSidebar } = useSidebar();
  const { menuItems } = useContext(MenuContext);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  // const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { theme } = useTheme();
  const { colors/*, theme, styles*/ } = useSharedStyles(); // Now we get colors directly
  const styles = useSharedStyles();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
  // const toggleSidebar = () => setIsSidebarVisible(prev => !prev);
  
  const toggleMenu = (id) => {
    setExpandedMenus(prev =>
      prev.includes(id) ? prev.filter(menuId => menuId !== id) : [...prev, id]
    );
  };

  const isActive = (link) => pathname === link || pathname.startsWith(`${link}/`);

  if (!isSidebarVisible) {
    return (
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          left: '10px',
          top: '90px',
          zIndex: 1000,
          background: styles.colors[theme].sidebarBg,
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <FaBars />
      </button>
    );
  }

  function toTitleCase(str) {
    if (!str) return ''; // Handle null or undefined
    return str
      .toLowerCase()
      .split(/[\s_-]+/) // Split on space, underscore, or dash
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return (
    <div style={styles.sidebarContainer}>
      {/* Fixed Header */}
      <div style={styles.sidebarHeader}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: colors[theme].sidebarText 
          }}>
            {toTitleCase(user?.role)} Menus
          </div>
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors[theme].sidebarText,
              cursor: 'pointer',
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Scrollable Sidebar Area */}
      <div style={styles.sidebarContent}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems
            .filter(item => (item.role_id === 0 || (user && item.role_id === user.role_id)) &&
              item.menu_item !== 'Add Product' && item.menu_item !== 'Log out'
            )
            .filter(item => (item.parent_id === null || (item.parent_id !== null && (user?.role_id !== 1 && user?.role_id !== 2))))
            .map(parent => {
              const IconComponent = FaIcons[parent.icon] || FaIcons.FaQuestionCircle;
              const children = menuItems.filter(child => parseInt(child.parent_id) === parseInt(parent.id));
              const showNestedMenus = user?.role_id === 1 || user?.role_id === 2;
              const isExpanded = expandedMenus.includes(parent.id);
              const active = isActive(parent.link);
              
              // const IconComponent = FaIcons[parent.icon] || FaIcons.FaQuestionCircle;
              // const children = 
              // (user?.role_id === 1 || user?.role_id === 2)?
              // menuItems.filter(child => parseInt(child.parent_id) === parseInt(parent.id))
              // :[];
              // const showNestedMenus = user?.role_id === 1 || user?.role_id === 2;
              // const isExpanded = (expandedMenus.includes(parent.id) && (user?.role_id === 1 || user?.role_id === 2));
              // const active = isActive(parent.link);

              return (
                <li key={parent.id}>
                  <div
                    style={{ 
                      ...styles.sidebarItem,
                      ...(active ? styles.sidebarItemActive : {}),
                      ...(hoveredItem === parent.id ? styles.sidebarItemHover : {}),
                      cursor: children.length > 0 ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      if (children.length > 0 && showNestedMenus) {
                        toggleMenu(parent.id);
                      } else if (parent.link) {
                        router.push(parent.link);
                      }
                    }}
                    onMouseEnter={() => setHoveredItem(parent.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <IconComponent style={{ 
                      ...styles.menuIcon,
                      marginRight: '12px'
                    }} />
                    <span style={{ flex: 1 }}>{parent.menu_item}</span>
                    {children.length > 0 && showNestedMenus && (
                      <span>{isExpanded ? '▾' : '▸'}</span>
                    )}
                  </div>

                  {isExpanded && showNestedMenus && children.length > 0 && (
                    <ul style={{ 
                      listStyle: 'none', 
                      paddingLeft: '32px',
                      margin: '4px 0'
                    }}>
                      {children.map(child => {
                        const ChildIcon = FaIcons[child.icon] || FaIcons.FaQuestionCircle;
                        const childActive = isActive(child.link);
                        return (
                          <li
                            key={child.id}
                            style={{
                              ...styles.sidebarItem,
                              ...(childActive ? styles.sidebarItemActive : {}),
                              ...(hoveredItem === child.id ? styles.sidebarItemHover : {}),
                              padding: '8px 12px',
                              margin: '4px 0'
                            }}
                            onClick={() => child.link && router.push(child.link)}
                            onMouseEnter={() => setHoveredItem(child.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <ChildIcon style={{ 
                              ...styles.menuIcon,
                              marginRight: '12px',
                              fontSize: '14px'
                            }} /> 
                            {child.menu_item}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </div>

      {/* Fixed Footer */}
      <div style={styles.sidebarFooter}>
        {/* <button 
          style={styles.textButton} 
          onClick={() => router.push('/add-product')}
          onMouseEnter={() => setHoveredItem('add-product')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaPlus style={{ ...styles.menuIcon, marginRight: '12px' }} /> 
          Add product
        </button> */}
        <button
          style={styles.textButton}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <FaSignOutAlt style={{ ...styles.menuIcon, marginRight: '12px' }} /> 
          Log out
        </button>
      </div>
    </div>
    // <div style={styles.sidebar}>
    //   <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    //     <button 
    //       onClick={toggleSidebar}
    //       style={{
    //         background: 'transparent',
    //         border: 'none',
    //         color: styles.colors[theme].sidebarText,
    //         cursor: 'pointer',
    //       }}
    //     >
    //       <FaTimes />
    //     </button>
    //   </div>

    //   <ul style={styles.sidebarList}>
    //     {menuItems
    //       .filter(item => (item.role_id === 0 || (user && item.role_id === user.role_id)) &&
    //         item.menu_item !== 'Add Product' && item.menu_item !== 'Log out'
    //       )
    //       .filter(item => item.parent_id === null)
    //       .map(parent => {
    //         const IconComponent = FaIcons[parent.icon] || FaIcons.FaQuestionCircle;
    //         const children = menuItems.filter(child => parseInt(child.parent_id) === parseInt(parent.id));
    //         const showNestedMenus = user?.role_id === 1 || user?.role_id === 2;
    //         const isExpanded = expandedMenus.includes(parent.id);
    //         const active = isActive(parent.link);

    //         return (
    //           <li key={parent.id}>
    //             <div
    //               style={{ 
    //                 ...styles.sidebarItem,
    //                 ...(active ? styles.sidebarItemActive : {}),
    //                 cursor: children.length > 0 ? 'pointer' : 'default'
    //               }}
    //               onClick={() => {
    //                 if (children.length > 0 && showNestedMenus) {
    //                   toggleMenu(parent.id);
    //                 } else if (parent.link) {
    //                   router.push(parent.link);
    //                 }
    //               }}
    //             >
    //               <IconComponent style={styles.menuIcon} />
    //               {parent.menu_item}
    //               {children.length > 0 && showNestedMenus && (
    //                 <span style={{ marginLeft: 'auto' }}>{isExpanded ? '▾' : '▸'}</span>
    //               )}
    //             </div>

    //             {isExpanded && showNestedMenus && children.length > 0 && (
    //               <ul style={styles.childMenuList}>
    //                 {children
    //                   .filter(child => parseInt(child.role_id) === 0 || parseInt(child.role_id) === parseInt(user.role_id))
    //                   .map(child => {
    //                     const ChildIcon = FaIcons[child.icon] || FaIcons.FaQuestionCircle;
    //                     const childActive = isActive(child.link);
    //                     return (
    //                       <li
    //                         key={child.id}
    //                         style={{
    //                           ...styles.childMenuItem,
    //                           ...(childActive ? styles.sidebarItemActive : {}),
    //                           color: theme === 'dark' ? (childActive ? 'white' : '#D4ADFC') : (childActive ? 'white' : '#8253D7'),
    //                         }}
    //                         onClick={() => child.link && router.push(child.link)}
    //                         onMouseEnter={() => setHoveredItem(child.id)}
    //                         onMouseLeave={() => setHoveredItem(null)}
    //                       >
    //                         <ChildIcon style={{ 
    //                           ...styles.childIcon,
    //                           color: theme === 'dark' ? (childActive ? 'white' : '#D4ADFC') : (childActive ? 'white' : '#8253D7')
    //                         }} /> 
    //                         {child.menu_item}
    //                       </li>
    //                     );
    //                   })}
    //               </ul>
    //             )}
    //           </li>
    //         );
    //       })}
    //   </ul>

    //   <div style={styles.sidebarFooter}>
    //     <button 
    //       style={styles.textButton} 
    //       onClick={() => router.push('/add-product')}
    //     >
    //       <FaPlus style={styles.menuIcon} /> Add product
    //     </button>

    //     <button
    //       style={styles.textButton}
    //       onClick={() => {
    //         localStorage.removeItem('token');
    //         localStorage.removeItem('user');
    //         router.push('/login');
    //       }}
    //     >
    //       <FaSignOutAlt style={styles.menuIcon} /> Log out
    //     </button>
    //   </div>
    // </div>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    top: '80px',
    left: 0,
    width: '250px',
    height: 'calc(100vh - 80px)',
    padding: '24px',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '0 12px 12px 0',
    transition: 'all 0.3s ease',
    zIndex: 999,
  },
  sidebarList: {
    listStyle: 'none',
    padding: '0',
    marginTop: '20px',
  },
  sidebarItem: {
    fontSize: '14px',
    marginBottom: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  menuIcon: {
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
  },
};