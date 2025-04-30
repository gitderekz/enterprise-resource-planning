'use client'; // Mark as a Client Component
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt, FaEdit, FaTrash, FaCheck, FaTimes,
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../lib/MenuContext';

const ProductDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get product ID from URL
    const products = [
        {
          id: 1,
          image: 'https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_1280.jpg',
          name: 'Unisex T-Shirt White',
          brand: 'Unnamed Brand',
          sizes: 'XS, S, M, L, XL, XXL',
          category: 'T-Shirt',
          gender: 'Male, Female',
          barcode: '123456789',
          productCode: 'TS123',
          orderName: 'Order #12345',
          lastUpdate: 'January 29, 2023 at 2:39PM',
          storeAvailability: [
            { store: 'Store 1', available: true },
            { store: 'Store 2', available: true },
            { store: 'Store 3', available: false },
            { store: 'Store 4', available: true },
          ],
        },
        {
          id: 2,
          image: 'https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_1280.jpg',
          name: 'Unisex T-Shirt Block',
          brand: 'Unnamed Brand',
          sizes: 'XS, S, M, L, XL, XXL',
          category: 'T-Shirt',
          gender: 'Male, Female',
          barcode: '987654321',
          productCode: 'TS456',
          orderName: 'Order #67890',
          lastUpdate: 'January 30, 2023 at 3:45PM',
          storeAvailability: [
            { store: 'Store 1', available: true },
            { store: 'Store 2', available: false },
            { store: 'Store 3', available: true },
            { store: 'Store 4', available: false },
          ],
        },
        // Add more products here
      ];


    // Find the product by ID
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return <div>Product not found</div>;
    }


  return (
    <div style={styles.container}>
      {/* Header */}
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
          <FaCommentDots style={styles.icon} />
          <FaBell style={styles.icon} />
          <FaCog style={styles.icon} />
          <FaUserCircle style={styles.icon} />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Menu</h2>
          <ul style={styles.sidebarList}>
            <li style={styles.sidebarItem}>
              <FaHome style={styles.menuIcon} /> Home
            </li>
            <li style={styles.sidebarItem}>
              <FaBox style={styles.menuIcon} /> Products
            </li>
            <li style={styles.sidebarItem}>
              <FaList style={styles.menuIcon} /> Categories
            </li>
            <li style={styles.sidebarItem}>
              <FaStore style={styles.menuIcon} /> Stores
            </li>
            <li style={styles.sidebarItem}>
              <FaWallet style={styles.menuIcon} /> Finances
            </li>
            <li style={styles.sidebarItem}>
              <FaCog style={styles.menuIcon} /> Settings
            </li>
          </ul>
          <div style={styles.sidebarFooter}>
            <button style={styles.textButton}>
              <FaPlus style={styles.menuIcon} /> Add product
            </button>
            <button style={styles.textButton}>
              <FaSignOutAlt style={styles.menuIcon} /> Log out
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        {/* <div style={styles.content}> */}
        <div style={{ 
          marginLeft: isSidebarVisible ? '250px' : '0',
          padding: '24px',
          width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
          transition: 'all 0.3s ease',
        }}>
          {/* Product Title and Last Update */}
          <h1 style={styles.productTitle}>{product.name}</h1>
          <div style={styles.lastUpdate}>Last update {product.lastUpdate}</div>

          {/* Product Details Section */}
          <div style={styles.detailsSection}>
            {/* Left Column */}
            <div style={styles.leftColumn}>
              {/* Image and Basic Info */}
              <div style={styles.imageRow}>
                <img src={product.image} alt={product.name} style={styles.productImage} />
                <div style={styles.basicInfo}>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productBrand}>{product.brand}</div>
                  <div style={styles.availableSizes}>Available sizes: {product.sizes}</div>
                  <div style={styles.productCategory}>Category: {product.category}</div>
                  <div style={styles.productGender}>Gender: {product.gender}</div>
                </div>
              </div>

              {/* Barcode, Product Code, and Order Name */}
              <div style={styles.infoRow}>
                <div style={styles.infoColumn}>
                  <div style={styles.infoLabel}>Barcode</div>
                  <div style={styles.infoValue}>{product.barcode}</div>
                </div>
                <div style={styles.infoColumn}>
                  <div style={styles.infoLabel}>Product Code</div>
                  <div style={styles.infoValue}>{product.productCode}</div>

                  <div style={styles.infoLabel}>Order Name</div>
                  <div style={styles.infoValue}>{product.orderName}</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.rightColumn}>
              {/* Delete and Edit Buttons */}
              <div style={styles.actionsRow}>
                <button style={styles.deleteButton}>
                  <FaTrash style={styles.buttonIcon} /> Delete
                </button>
                <button style={styles.editButton}>
                  <FaEdit style={styles.buttonIcon} /> Edit Product
                </button>
              </div>

              {/* Store Availability Table */}
              <div style={styles.storeAvailability}>
                <h3 style={styles.storeAvailabilityTitle}>Store Availability</h3>
                <div style={styles.storeTable}>
                  <div style={styles.storeTableHeader}>
                    <div style={styles.storeTableHeaderCell}>Store</div>
                    <div style={styles.storeTableHeaderCell}>Availability</div>
                  </div>
                  <div style={styles.storeTableBody}>
                    {product.storeAvailability.map((store, index) => (
                      <div key={index} style={styles.storeTableRow}>
                        <div style={styles.storeTableCell}>{store.store}</div>
                        <div style={styles.storeTableCell}>
                          {store.available ? (
                            <FaCheck style={styles.checkIcon} />
                          ) : (
                            <FaTimes style={styles.timesIcon} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    backgroundColor: '#ffffff', // White header
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
  mainContent: {
    display: 'flex',
    marginTop: '80px',
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
  productTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3436', // Dark gray text
    marginBottom: '8px',
  },
  lastUpdate: {
    fontSize: '14px',
    color: '#636e72', // Medium gray text
    marginBottom: '24px',
  },
  detailsSection: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#ffffff', // White background
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  leftColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  imageRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  productImage: {
    width: '150px',
    height: '150px',
    borderRadius: '8px', // Rounded corners
  },
  basicInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3436', // Dark gray text
  },
  productBrand: {
    fontSize: '14px',
    color: '#636e72', // Medium gray text
  },
  availableSizes: {
    fontSize: '14px',
    color: '#636e72', // Medium gray text
  },
  productCategory: {
    fontSize: '14px',
    color: '#636e72', // Medium gray text
  },
  productGender: {
    fontSize: '14px',
    color: '#636e72', // Medium gray text
  },
  infoRow: {
    display: 'flex',
    gap: '16px',
  },
  infoColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#636e72', // Medium gray text
  },
  infoValue: {
    fontSize: '14px',
    color: '#2d3436', // Dark gray text
  },
  rightColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  actionsRow: {
    display: 'flex',
    gap: '16px',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #6A3CBC', // Purple border
    borderRadius: '8px',
    color: '#6A3CBC', // Purple text
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#461B93', // Dark purple background
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff', // White text
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  buttonIcon: {
    fontSize: '14px',
  },
  storeAvailability: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  storeAvailabilityTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3436', // Dark gray text
  },
  storeTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  storeTableHeader: {
    display: 'flex',
    backgroundColor: '#f5f6fa', // Light gray background
    padding: '8px 16px',
    borderRadius: '8px',
  },
  storeTableHeaderCell: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3436', // Dark gray text
  },
  storeTableBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  storeTableRow: {
    display: 'flex',
    padding: '8px 16px',
    backgroundColor: '#ffffff', // White background
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  storeTableCell: {
    flex: 1,
    fontSize: '14px',
    color: '#2d3436', // Dark gray text
  },
  checkIcon: {
    color: '#00b894', // Green checkmark
  },
  timesIcon: {
    color: '#d63031', // Red cross
  },
};

export default ProductDetailsPage;