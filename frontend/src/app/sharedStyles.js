// sharedStyles.js
import { useContext } from 'react';
import { ThemeContext } from './lib/ThemeContext';

export const useSharedStyles = () => {
  const { theme, colors } = useContext(ThemeContext);

  const getColor = (lightColor, darkColor) => {
    return theme === 'dark' ? darkColor : lightColor;
  };

  return {
    colors, // Make colors available directly
    theme,  // Make current theme available
    // styles: {
      sidebarContainer: {
        position: 'fixed',
        top: '80px',
        left: 0,
        width: '250px',
        height: 'calc(100vh - 80px)',
        backgroundColor: colors[theme].sidebarBg,
        boxShadow: theme === 'dark' ? '2px 0 8px rgba(0, 0, 0, 0.3)' : '2px 0 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '0 12px 12px 0',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
      },
      sidebarHeader: {
        padding: '16px',
        display: 'flex',
        justifyContent: 'flex-end',
        flexShrink: 0,
      },
      sidebarContent: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 16px 16px',
      },
      sidebarItem: {
        fontSize: '14px',
        color: colors[theme].sidebarText,
        marginBottom: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.3s',
      },
      sidebarItemHover: {
        backgroundColor: theme === 'dark' ? '#16213e' : '#6A3CBC',
      },
      container: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: colors[theme].background,
        color: colors[theme].text,
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
        backgroundColor: colors[theme].background,
        padding: '16px 24px',
        boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      },
      headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      },
      logo: {
        fontSize: '20px',
        fontWeight: '600',
        color: colors[theme].primary,
      },
      searchBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f6fa',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '300px',
        border: `1px solid ${colors[theme].primary}`,
      },
      searchIcon: {
        color: colors[theme].primary,
        marginRight: '8px',
      },
      searchInput: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        color: colors[theme].text,
        width: '100%',
      },
      headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      },
      icon: {
        color: colors[theme].primary,
        fontSize: '20px',
        cursor: 'pointer',
      },
      popup: {
        position: 'absolute',
        top: '40px',
        right: 0,
        backgroundColor: colors[theme].cardBg,
        boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
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
        color: colors[theme].text,
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
        backgroundColor: colors[theme].sidebarBg,
        padding: '24px',
        boxShadow: theme === 'dark' ? '2px 0 8px rgba(0, 0, 0, 0.3)' : '2px 0 8px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '0 12px 12px 0',
        zIndex: 999,
        transition: 'all 0.3s ease',
      },
      sidebarList: {
        listStyle: 'none',
        padding: '0',
        marginTop: '20px',
      },
      sidebarItem: {
        fontSize: '14px',
        color: colors[theme].sidebarText,
        marginBottom: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: theme === 'dark' ? '#16213e' : '#6A3CBC',
        },
      },
      sidebarItemActive: {
        backgroundColor: theme === 'dark' ? '#16213e' : '#6A3CBC',
        color: '#ffffff',
      },
      menuIcon: {
        color: colors[theme].sidebarText,
        fontSize: '16px',
      },
      sidebarFooter: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: `1px solid ${theme === 'dark' ? '#2d2d2d' : '#D4ADFC'}`,
      },
      textButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: colors[theme].sidebarText,
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: theme === 'dark' ? '#16213e' : '#6A3CBC',
        },
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
        color: theme === 'dark' ? '#D4ADFC' : '#8253D7',
      },
      childMenuItemHover: {
        backgroundColor: theme === 'dark' ? '#16213e' : '#6A3CBC',
        color: '#ffffff',
      },
      childIcon: {
        marginRight: '8px',
        fontSize: '14px',
        color: theme === 'dark' ? '#D4ADFC' : '#8253D7',
      },
      content: {
        marginLeft: '250px',
        padding: '24px',
        width: 'calc(100% - 250px)',
        overflowY: 'auto',
        height: 'calc(100vh - 80px)',
        backgroundColor: colors[theme].background,
      },
      pageTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: colors[theme].text,
        marginBottom: '24px',
      },

      // DASHBOARD STYLES
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
        backgroundColor: colors[theme].cardBg,
        borderRadius: '8px',
        padding: '16px',
        boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: '200px',
        textAlign: 'center',
      },
      cardNumber: {
        fontSize: '32px',
        fontWeight: '600',
        color: colors[theme].primary,
      },
      cardUnit: {
        fontSize: '14px',
        color: colors[theme].secondary,
        margin: '8px 0',
      },
      cardTitle: {
        fontSize: '16px',
        color: colors[theme].text,
      },
      scrollArrow: {
        backgroundColor: colors[theme].primary,
        borderRadius: '50%',
        padding: '12px',
        cursor: 'pointer',
      },
      arrowIcon: {
        color: '#ffffff',
        fontSize: '20px',
      },
      bottomSection: {
        backgroundColor: colors[theme].cardBg,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      bottomRow: {
        display: 'flex',
        gap: '24px',
        marginBottom: '24px',
      },
      bottomCard: {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f5f6fa',
        borderRadius: '8px',
        padding: '16px',
        flex: 1,
      },
      bottomCardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: colors[theme].text,
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
        backgroundColor: colors[theme].primary,
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
        color: colors[theme].text,
      },
      storeList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '16px',
        overflowX: 'auto',
      },
      storeItem: {
        display: 'flex',
        gap: '16px',
        padding: '12px',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f5f6fa',
        borderRadius: '8px',
        minWidth: '300px',
        color: colors[theme].text,
      },

      // SETTINGS STYLES
      personalInfo: {
        display: 'flex',
        gap: '24px',
        marginBottom: '24px',
      },
      personalInfoColumn: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
      },
      infoGroup: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
      },
      label: {
          fontSize: '14px',
          color: '#636e72', // Medium gray text
      },
      input: {
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #6A3CBC', // Purple border
          fontSize: '14px',
          color: '#2d3436', // Dark gray text
          outline: 'none',
          backgroundColor: '#f5f6fa', // Light gray background
      },
      rolePermissions: {
          display: 'flex',
          gap: '24px',
      },
      roleSection: {
          flex: 1,
          backgroundColor: '#f5f6fa', // Light gray background
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      sectionTitle: {
          fontSize: '20px',
          fontWeight: '600',
          color: '#2d3436', // Dark gray text
          marginBottom: '16px',
      },
      roleOptions: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
      },
      roleOption: {
          fontSize: '14px',
          color: '#2d3436', // Dark gray text
      },
      permissionsSection: {
          flex: 2,
          backgroundColor: '#f5f6fa', // Light gray background
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      permissionsTable: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
      },

      // ASSESSMENT STYLES
      viewRange: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
      },
      viewRangeLabel: {
          fontSize: '14px',
          color: '#636e72',
      },
      viewRangeDropdown: {
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #6A3CBC',
          fontSize: '14px',
          color: '#2d3436',
          outline: 'none',
      },
      financialMetrics: {
          display: 'flex',
          gap: '24px',
          marginBottom: '24px',
      },
      financialMetric: {
          flex: 1,
          backgroundColor: '#f5f6fa',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      metricTitle: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#2d3436',
          marginBottom: '8px',
      },
      metricValue: {
          fontSize: '20px',
          fontWeight: '600',
          color: '#2d3436',
      },
      metricChange: {
          fontSize: '14px',
          color: '#00b894',
      },
      revenueBreakdown: {
          backgroundColor: '#f5f6fa',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      sectionTitle: {
          fontSize: '20px',
          fontWeight: '600',
          color: '#2d3436',
          marginBottom: '16px',
      },
      revenueCategories: {
          display: 'flex',
          gap: '16px',
      },
      revenueCategory: {
          fontSize: '14px',
          color: '#2d3436',
      },


      // PRODUCTS STYLES
      actions: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
      },
      searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
        borderRadius: '8px',
        padding: '8px 12px',
        border: `1px solid ${colors[theme].primary}`,
        flex: 1,
      },
      filterContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#3700B3' : '#CDC1FF',
        borderRadius: '8px',
        padding: '8px 12px',
        gap: '8px',
      },
      filterIcon: {
        color: colors[theme].primary,
      },
      filterDropdown: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        color: colors[theme].primary,
      },
      addProductButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: colors[theme].primary,
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      },
      addProductIcon: {
        color: '#ffffff',
      },
      table: {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        borderRadius: '8px',
        boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      },
      tableHeader: {
        display: 'flex',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f6fa',
        padding: '12px 16px',
        borderBottom: `2px solid ${colors[theme].primary}`,
      },
      tableHeaderCell: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: colors[theme].text,
      },
      sortIcon: {
        color: colors[theme].primary,
      },
      tableBody: {
        display: 'flex',
        flexDirection: 'column',
      },
      tableRow: {
        display: 'flex',
        padding: '12px 16px',
        borderBottom: `1px solid ${theme === 'dark' ? '#2d2d2d' : '#f5f6fa'}`,
        '&:hover': {
          backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f6fa',
        },
      },
      tableCell: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: colors[theme].text,
      },
      checkbox: {
        width: '16px',
        height: '16px',
        accentColor: colors[theme].primary,
      },
      productImage: {
        width: '50px',
        height: '50px',
        borderRadius: '8px',
      },
      productName: {
        fontWeight: '600',
      },
      statusBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: (status) => 
          status === 'active' ? '#00b894' : 
          status === 'inactive' ? '#d63031' : 
          colors[theme].primary,
      },
      inactiveText: {
        color: theme === 'dark' ? '#7f8c8d' : '#b2bec3',
      },

      // FORM STYLES
      form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      },
      formRow: {
        display: 'flex',
        gap: '24px',
      },
      formColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      },
      formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      label: {
        fontSize: '14px',
        color: colors[theme].text,
      },
      input: {
        padding: '8px',
        borderRadius: '8px',
        border: `1px solid ${colors[theme].primary}`,
        fontSize: '14px',
        color: colors[theme].text,
        outline: 'none',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
      },
      textarea: {
        padding: '8px',
        borderRadius: '8px',
        border: `1px solid ${colors[theme].primary}`,
        fontSize: '14px',
        color: colors[theme].text,
        outline: 'none',
        resize: 'vertical',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
      },
      select: {
        padding: '8px',
        borderRadius: '8px',
        border: `1px solid ${colors[theme].primary}`,
        fontSize: '14px',
        color: colors[theme].text,
        outline: 'none',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
      },
      formActions: {
        display: 'flex',
        justifyContent: 'center',
      },
      saveButton: {
        display: 'flex',
        padding: '12px 24px',
        backgroundColor: colors[theme].primary,
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      },
      saveIcon: {
        marginRight: '8px',
      },

      // MODAL STYLES
      modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      modalContent: {
        backgroundColor: colors[theme].cardBg,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      },
      closeButton: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'transparent',
        border: 'none',
        color: colors[theme].text,
        fontSize: '16px',
        cursor: 'pointer',
      },

      // UTILITY STYLES
      textPrimary: {
        color: colors[theme].primary,
      },
      textSecondary: {
        color: colors[theme].secondary,
      },
      bgPrimary: {
        backgroundColor: colors[theme].primary,
      },
      bgSecondary: {
        backgroundColor: colors[theme].secondary,
      },
      success: {
        color: '#00b894',
      },
      error: {
        color: '#d63031',
      },
      warning: {
        color: '#fdcb6e',
      },
      info: {
        color: '#0984e3',
      },
    // }
  };
};