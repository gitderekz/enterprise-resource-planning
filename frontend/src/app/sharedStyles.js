// sharedStyles.js
import { useContext } from 'react';
import { ThemeContext } from './lib/ThemeContext';

export const useSharedStyles = () => {
  const { colors } = useContext(ThemeContext);

  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: colors.background,
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
      backgroundColor: colors.background,
      padding: '16px 24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
      color: colors.primary,
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: '8px',
      padding: '8px 12px',
      width: '300px',
      border: `1px solid ${colors.primary}`,
    },
    searchIcon: {
      color: colors.primary,
      marginRight: '8px',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      color: colors.primary,
      width: '100%',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    icon: {
      color: colors.primary,
      fontSize: '20px',
      cursor: 'pointer',
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
      backgroundColor: colors.secondary,
      padding: '24px',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '0 12px 12px 0',
    },
    sidebarTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '24px',
    },
    sidebarList: {
      listStyle: 'none',
      padding: '0',
    },
    sidebarItem: {
      fontSize: '14px',
      color: colors.text,
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
      backgroundColor: colors.tertiary,
    },
    menuIcon: {
      color: colors.text,
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
      color: colors.text,
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
      backgroundColor: colors.background,
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: colors.text,
      marginBottom: '24px',
    },
    // Add more styles as needed
    // DASHBOARD
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

    // PRODUCTS
    actions: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
      },
      searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff', // White background
        borderRadius: '8px',
        padding: '8px 12px',
        border: '1px solid #6A3CBC', // Purple border
        flex: 1,
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
      filterContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#CDC1FF', // Light purple background
        borderRadius: '8px',
        padding: '8px 12px',
        gap: '8px',
      },
      filterIcon: {
        color: '#461B93', // Dark purple icon
      },
      filterDropdown: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        color: '#461B93', // Dark purple text
      },
      addProductButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: '#461B93', // Dark purple background
        color: '#ffffff', // White text
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      },
      addProductIcon: {
        color: '#ffffff', // White icon
      },
      table: {
        backgroundColor: '#ffffff', // White background
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      },
      tableHeader: {
        display: 'flex',
        backgroundColor: '#f5f6fa', // Light gray background
        padding: '12px 16px',
        borderBottom: '2px solid #6A3CBC', // Purple bottom border
      },
      tableHeaderCell: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3436', // Dark gray text
      },
      sortIcon: {
        color: '#6A3CBC', // Purple icon
      },
      tableBody: {
        display: 'flex',
        flexDirection: 'column',
      },
      tableRow: {
        display: 'flex',
        padding: '12px 16px',
        borderBottom: '1px solid #f5f6fa', // Light gray border
      },
      tableCell: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#2d3436', // Dark gray text
      },
      checkbox: {
        width: '16px',
        height: '16px',
        accentColor: '#6A3CBC', // Purple checkbox
      },
      productImage: {
        width: '50px',
        height: '50px',
        borderRadius: '8px', // Rounded corners
      },
      productName: {
        fontWeight: '600',
      },
      statusBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        color: '#ffffff', // White text
        fontSize: '12px',
        fontWeight: '500',
      },
      inactiveText: {
        color: '#b2bec3', // Inactive text color
      },

    // CATEGORIES

    // STORES
    actions: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
        borderRadius: '8px',
        padding: '8px 12px',
        border: '1px solid #6A3CBC', // Purple border
        flex: 1,
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
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#CDC1FF', // Light purple background
        borderRadius: '8px',
        padding: '8px 12px',
        gap: '8px',
    },
    filterIcon: {
        color: '#461B93', // Dark purple icon
    },
    filterDropdown: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        color: '#461B93', // Dark purple text
    },
    addStoreButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: '#461B93', // Dark purple background
        color: '#ffffff', // White text
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    addStoreIcon: {
        color: '#ffffff', // White icon
    },
    storeList: {
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
    },
    storeCard: {
        backgroundColor: '#f5f6fa', // Light gray background
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        minWidth: '200px',
        textAlign: 'center',
    },
    storeImage: {
        width: '100px',
        height: '100px',
        borderRadius: '8px',
    },
    storeName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2d3436', // Dark gray text
        marginTop: '8px',
    },
    storeDetails: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff', // White background
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '2px solid #6A3CBC', // Purple border
        zIndex: 1000,
    },
    closeButton: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#6A3CBC', // Purple text
        fontSize: '16px',
        cursor: 'pointer',
    },
    storeDetailsTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2d3436', // Dark gray text
        marginBottom: '16px',
    },
    storeDetailsContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    storeDetailsRow: {
        display: 'flex',
        gap: '24px',
    },
    storeDetailsColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },

    // FINANCES
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
    
    // FINANCES
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
    tableHeader: {
        display: 'flex',
        backgroundColor: '#ffffff', // White background
        padding: '8px 16px',
        borderRadius: '8px',
    },
    tableHeaderCell: {
        flex: 1,
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3436', // Dark gray text
    },
    tableRow: {
        display: 'flex',
        padding: '8px 16px',
        backgroundColor: '#ffffff', // White background
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    tableCell: {
        flex: 1,
        fontSize: '14px',
        color: '#2d3436', // Dark gray text
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },

    // ADD-PRODUCT
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
        color: '#2d3436', // Dark gray text
    },
    input: {
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #6A3CBC', // Purple border
        fontSize: '14px',
        color: '#2d3436', // Dark gray text
        outline: 'none',
    },
    textarea: {
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #6A3CBC', // Purple border
        fontSize: '14px',
        color: '#2d3436', // Dark gray text
        outline: 'none',
        resize: 'vertical',
    },
    select: {
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #6A3CBC', // Purple border
        fontSize: '14px',
        color: '#2d3436', // Dark gray text
        outline: 'none',
    },
    formActions: {
        display: 'flex',
        justifyContent: 'center',
    },
    saveButton: {
        display: 'flex',
        padding: '12px 24px',
        backgroundColor: '#461B93', // Dark purple background
        color: '#ffffff', // White text
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    saveIcon: {
        marginRight: '8px',
    },
  };
};