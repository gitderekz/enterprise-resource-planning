'use client'; // Mark as a Client Component
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
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