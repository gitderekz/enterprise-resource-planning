'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function SidebarProvider({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // Try to get saved preference from localStorage
      const saved = localStorage.getItem('sidebarVisible');
      
      // If no saved preference, use responsive default
      if (saved === null) {
        return window.innerWidth > 768; // Only visible by default on larger screens
      }
      
      // Return saved preference if exists
      return JSON.parse(saved);
    }
    // Server-side default
    return true;
  });

  // Save to localStorage when sidebar visibility changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarVisible', JSON.stringify(isSidebarVisible));
    }
  }, [isSidebarVisible]);

  // Handle window resize with debounce for performance
  useEffect(() => {
    const handleResize = debounce(() => {
      if (typeof window !== 'undefined') {
        // Auto-hide on small screens, but respect user preference on larger screens
        if (window.innerWidth <= 768) {
          setIsSidebarVisible(false);
        } else {
          // Check localStorage again in case it changed
          const saved = localStorage.getItem('sidebarVisible');
          if (saved !== null) {
            setIsSidebarVisible(JSON.parse(saved));
          }
        }
      }
    }, 100);

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Alternative media query approach (commented out)
  /*
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      const handleMediaChange = (e) => {
        setIsSidebarVisible(!e.matches);
      };
      
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, []);
  */

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle with Ctrl+/ or Cmd+/ (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault(); // Prevent browser search from opening
        setIsSidebarVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SidebarContext.Provider value={{ 
      isSidebarVisible, 
      setIsSidebarVisible,
      // Optional: expose a toggle function
      toggleSidebar: () => setIsSidebarVisible(prev => !prev)
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Optional: TypeScript types if you're using TypeScript
/*
interface SidebarContextType {
  isSidebarVisible: boolean;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}
*/