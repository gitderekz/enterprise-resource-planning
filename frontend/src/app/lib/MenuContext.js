'use client'; // Mark as a Client Component
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await axios.get('http://localhost:5000/api/menu');
      console.log("response",response);
      
      setMenuItems(response.data);
    };
    fetchMenuItems();
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems }}>
      {children}
    </MenuContext.Provider>
  );
};