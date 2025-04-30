'use client'; // Mark as a Client Component
import React, { useState } from 'react';
import {
  FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaHome, FaBox, FaList, FaStore, FaWallet, FaPlus, FaSignOutAlt,
  FaFilter,FaTimes
} from 'react-icons/fa'; // Icons from react-icons
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../lib/SidebarContext';
import { MenuContext } from '../../lib/MenuContext';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useSharedStyles } from '../sharedStyles';

const StoresPage = () => {
  const styles = useSharedStyles();
  const [selectedStore, setSelectedStore] = useState(null);
  const stores = [
    {
      id: 1,
      name: 'Manchester, UK',
      image: 'https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_1280.jpg',
      employees: 23,
      items: 308,
      orders: 2,
      refunds: 1,
      mostSoldItem: 'Unisex T-shirt White',
      mostPopularCategory: 'T-shirts',
      customerSatisfaction: '93%',
      status: 'Open',
    },
    {
      id: 2,
      name: 'Yorkshire, UK',
      image: 'https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_1280.jpg',
      employees: 11,
      items: 291,
      orders: 1,
      refunds: 0,
      mostSoldItem: 'Unisex T-shirt Block',
      mostPopularCategory: 'T-shirts',
      customerSatisfaction: '89%',
      status: 'Open',
    },
    {
      id: 3,
      name: 'Hull, UK',
      image: 'https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_1280.jpg',
      employees: 5,
      items: 41,
      orders: 0,
      refunds: 0,
      mostSoldItem: 'Tonk Top White',
      mostPopularCategory: 'Tops',
      customerSatisfaction: '85%',
      status: 'Closed',
    },
    {
      id: 4,
      name: 'Leicester, UK',
      image: 'https://cdn.pixabay.com/photo/2025/03/09/16/02/hare-9457418_1280.jpg',
      employees: 16,
      items: 261,
      orders: 3,
      refunds: 1,
      mostSoldItem: 'Rain Jacket Mole',
      mostPopularCategory: 'Outwear',
      customerSatisfaction: '91%',
      status: 'Open',
    },
  ];


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
        <h1 style={styles.pageTitle}>Stores</h1>

        {/* Search, Filter, and Add Store */}
        <div style={styles.actions}>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterContainer}>
            <FaFilter style={styles.filterIcon} />
            <select style={styles.filterDropdown}>
              <option>Filter by</option>
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>
          <button style={styles.addStoreButton}>
            <FaPlus style={styles.addStoreIcon} /> Add Store
          </button>
        </div>

        {/* Store Cards */}
        <div style={styles.storeList}>
          {stores.map((store) => (
            <div
              key={store.id}
              style={styles.storeCard}
              onClick={() => setSelectedStore(store)}
            >
              <img src={store.image} alt={store.name} style={styles.storeImage} />
              <div style={styles.storeName}>{store.name}</div>
            </div>
          ))}
        </div>

        {/* Store Details */}
        {selectedStore && (
          <div style={styles.storeDetails}>
            <button
              style={styles.closeButton}
              onClick={() => setSelectedStore(null)}
            >
              <FaTimes />
            </button>
            <h2 style={styles.storeDetailsTitle}>{selectedStore.name}</h2>
            <div style={styles.storeDetailsContent}>
              <div style={styles.storeDetailsRow}>
                <div style={styles.storeDetailsColumn}>
                  <div>Employees: {selectedStore.employees}</div>
                  <div>Items: {selectedStore.items}</div>
                  <div>Orders: {selectedStore.orders}</div>
                  <div>Refunds: {selectedStore.refunds}</div>
                </div>
                <div style={styles.storeDetailsColumn}>
                  <div>Most sold items: {selectedStore.mostSoldItem}</div>
                  <div>Most popular category: {selectedStore.mostPopularCategory}</div>
                  <div>Customer satisfaction: {selectedStore.customerSatisfaction}</div>
                  <div>Status: {selectedStore.status}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};


export default StoresPage;