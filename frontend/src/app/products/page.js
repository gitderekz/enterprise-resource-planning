'use client'; // Mark as a Client Component
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaSearch, FaFilter, FaPlus, FaSort, FaCheck, FaTimes,FaCommentDots,FaBell,
  FaUserCircle,
  FaHome,
  FaBox,
  FaList,
  FaStore,
  FaWallet,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa'; // Icons from react-icons
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { useSharedStyles } from '../sharedStyles';

const ProductsPage = () => {
  const styles = useSharedStyles();
  const products = [
    {
      id: 1,
      image: 'https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg',
      name: 'Unisex T-Shirt White',
      status: 'Active',
      stock: '12 in stock',
      category: 'T-Shirt',
      location: 'Store 3',
    },
    {
      id: 2,
      image: 'https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg',
      name: 'Unisex T-Shirt Block',
      status: 'Active',
      stock: '10 in stock',
      category: 'T-Shirt',
      location: 'Store 4',
    },
    {
      id: 3,
      image: 'https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg',
      name: 'Tonk Top White',
      status: 'Active',
      stock: '28 in stock',
      category: 'Tops',
      location: 'Store 3',
    },
    {
      id: 4,
      image: 'https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg',
      name: 'Rain Jacket Mole',
      status: 'Active',
      stock: '12 in stock',
      category: 'Outwear',
      location: 'Store 3',
    },
    {
      id: 5,
      image: 'https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg',
      name: 'Bomber Jacket Mole',
      status: 'Sold out',
      stock: '0 in stock',
      category: 'Outwear',
      location: 'Store 1',
    },
    {
      id: 6,
      image: 'https://cdn.pixabay.com/photo/2025/02/14/13/46/crested-tit-9406740_1280.jpg',
      name: 'Boots',
      status: 'Low in stock',
      stock: '1 in stock',
      category: 'Outwear',
      location: 'Store 1',
    },
  ];

  const router = useRouter();
  const handleProductClick = (id) => {
    console.log('id',id);
    
    router.push(`/product-details/${id}`);
  };

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
          {/* Page Title */}
          <h1 style={styles.pageTitle}>Products</h1>

          {/* Search, Filter, and Add Product */}
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
                <option>Active</option>
                <option>Sold out</option>
                <option>Low in stock</option>
              </select>
            </div>
            <button style={styles.addProductButton}>
              <FaPlus style={styles.addProductIcon} /> Add Product
            </button>
          </div>

          {/* Table */}
          <div style={styles.table}>
            {/* Table Header */}
            <div style={styles.tableHeader}>
              <div style={styles.tableHeaderCell}>
                Name of product <FaSort style={styles.sortIcon} />
              </div>
              <div style={styles.tableHeaderCell}>
                Status <FaSort style={styles.sortIcon} />
              </div>
              <div style={styles.tableHeaderCell}>
                Stock Info <FaSort style={styles.sortIcon} />
              </div>
              <div style={styles.tableHeaderCell}>
                Category <FaSort style={styles.sortIcon} />
              </div>
              <div style={styles.tableHeaderCell}>
                Location <FaSort style={styles.sortIcon} />
              </div>
            </div>

            {/* Table Body */}
            <div style={styles.tableBody}>
              {products.map((product) => (
                <div key={product.id} style={styles.tableRow} onClick={() => handleProductClick(product.id)} >
                  <div style={styles.tableCell}>
                    <input type="checkbox" style={styles.checkbox} />
                    <img src={product.image} alt={product.name} style={styles.productImage} />
                    <div style={styles.productName}>{product.name}</div>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={{ ...styles.statusBadge, backgroundColor: getStatusColor(product.status) }}>
                      {product.status}
                    </div>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={product.stock === '0 in stock' ? styles.inactiveText : null}>
                      {product.stock}
                    </div>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={product.stock === '0 in stock' ? styles.inactiveText : null}>
                      {product.category}
                    </div>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={product.stock === '0 in stock' ? styles.inactiveText : null}>
                      {product.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return '#8253D7';
    case 'Sold out':
      return '#461B93';
    case 'Low in stock':
      return '#6A3CBC';
    default:
      return '#8253D7';
  }
};


export default ProductsPage;