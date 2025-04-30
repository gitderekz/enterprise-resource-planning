'use client'; // Mark as a Client Component
// import { createContext, useState, useEffect } from 'react';

// export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('light');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     setTheme(savedTheme);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
// lib/ThemeContext.tsx
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const lightTheme = {
    primary: '#6A3CBC', // Light Purple
    secondary: '#8253D7', // Light Purple
    tertiary: '#D4ADFC', // Light Lavender
    background: '#f5f6fa', // Light background
    text: '#2d3436', // Dark text color
  };

  const darkTheme = {
    primary: '#070F2B', // Dark Blue
    secondary: '#1B1A55', // Dark Purple
    tertiary: '#535C91', // Medium Purple
    background: '#9290C3', // Light Lavender background
    text: '#ffffff', // Light text color
  };

  const [colors, setColors] = useState(lightTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setColors(savedTheme === 'light' ? lightTheme : darkTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setColors(newTheme === 'light' ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
