'use client';

import React from 'react';
import { useSidebar } from '../../lib/SidebarContext';
import Sidebar from '@/app/components/sidebar';
import Header from '@/app/components/header';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const ProductDetailsClient = ({ id }) => {
  const { isSidebarVisible } = useSidebar();

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
  ];

  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return <div>Product not found</div>;

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        <Sidebar />
        <div
          style={{
            marginLeft: isSidebarVisible ? '250px' : '0',
            padding: '24px',
            width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
            transition: 'all 0.3s ease',
          }}
        >
          <h1 style={styles.productTitle}>{product.name}</h1>
          <div style={styles.lastUpdate}>Last update {product.lastUpdate}</div>

          <div style={styles.detailsSection}>
            {/* Left Column */}
            <div style={styles.leftColumn}>
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
              <div style={styles.actionsRow}>
                <button style={styles.deleteButton}>
                  <FaTrash style={styles.buttonIcon} /> Delete
                </button>
                <button style={styles.editButton}>
                  <FaEdit style={styles.buttonIcon} /> Edit Product
                </button>
              </div>

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
                            <FaCheck style={{ color: '#00b894' }} />
                          ) : (
                            <FaTimes style={{ color: '#d63031' }} />
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
    backgroundColor: '#f5f6fa',
    minHeight: '100vh',
  },
  mainContent: {
    display: 'flex',
    marginTop: '80px',
  },
  productTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  lastUpdate: {
    fontSize: '14px',
    color: '#636e72',
    marginBottom: '24px',
  },
  detailsSection: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
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
    borderRadius: '8px',
  },
  basicInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productName: {
    fontSize: '20px',
    fontWeight: '600',
  },
  productBrand: {
    fontSize: '14px',
    color: '#636e72',
  },
  availableSizes: {
    fontSize: '14px',
    color: '#636e72',
  },
  productCategory: {
    fontSize: '14px',
    color: '#636e72',
  },
  productGender: {
    fontSize: '14px',
    color: '#636e72',
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
    color: '#636e72',
  },
  infoValue: {
    fontSize: '14px',
    color: '#2d3436',
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
    border: '1px solid #6A3CBC',
    borderRadius: '8px',
    color: '#6A3CBC',
    background: 'transparent',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#fff',
    background: '#461B93',
    border: 'none',
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
  },
  storeTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  storeTableHeader: {
    display: 'flex',
    backgroundColor: '#f5f6fa',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  storeTableHeaderCell: {
    flex: 1,
    fontWeight: '600',
    fontSize: '14px',
  },
  storeTableBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  storeTableRow: {
    display: 'flex',
    padding: '8px 16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  storeTableCell: {
    flex: 1,
    fontSize: '14px',
  },
};

export default ProductDetailsClient;
