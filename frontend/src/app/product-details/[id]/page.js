'use client'; // Mark as a Client Component
import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { useRouter,usePathname,useParams } from 'next/navigation'; // Next.js router
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt, FaEdit, FaTrash, FaCheck, FaTimes,
} from 'react-icons/fa'; // Icons from react-icons
import { MenuContext } from '../../lib/MenuContext';
import Sidebar from '@/app/components/sidebar';
import Header from '@/app/components/header';

const ProductDetailsPage = () => {
    const router = useRouter();
    const pathName = usePathname();
    const params = useParams()

    const { id } = params; // Get product ID from URL

    if (!id) {
      return <div>Loading...</div>; // Optionally show a loading state until productId is available
    }

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
      <Header />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar />

        {/* Scrollable Content */}
        <div style={styles.content}>
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