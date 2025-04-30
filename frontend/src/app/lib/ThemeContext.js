'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const colors = {
    light: {
      primary: '#8253D7',
      secondary: '#461B93',
      background: '#ffffff',
      text: '#2d3436',
      cardBg: '#f5f6fa',
      sidebarBg: '#8253D7',
      sidebarText: '#ffffff',
    },
    dark: {
      primary: '#BB86FC',
      secondary: '#3700B3',
      background: '#121212',
      text: '#e1e1e1',
      cardBg: '#1e1e1e',
      sidebarBg: '#1a1a2e',
      sidebarText: '#ffffff',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}