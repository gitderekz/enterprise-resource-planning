// 'use client';
// import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';

// export const WebSocketContext = createContext(null);

// // WebSocket close codes for better error handling
// const WS_CLOSE_CODES = {
//   NORMAL: 1000,
//   GOING_AWAY: 1001,
//   PROTOCOL_ERROR: 1002,
//   UNSUPPORTED: 1003,
//   ABNORMAL: 1006,
//   INTERNAL_ERROR: 1011
// };

// export function WebSocketProvider({ children }) {
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const [connectionState, setConnectionState] = useState('disconnected');
//   const audioRef = useRef(null);
//   const reconnectAttempts = useRef(0);

//   // Initialize audio on first user interaction
//   useEffect(() => {
//     const handleFirstInteraction = () => {
//       const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//       audio.volume = 0.3;
//       audioRef.current = audio;
//       audio.play().then(() => {
//         audio.pause();
//         audio.currentTime = 0;
//       }).catch(console.error);
//       document.removeEventListener('click', handleFirstInteraction);
//     };

//     document.addEventListener('click', handleFirstInteraction);
//     return () => document.removeEventListener('click', handleFirstInteraction);
//   }, []);

//   const playSound = useCallback((notification) => {
//     if (!soundEnabled) return;

//     const storedUser = localStorage.getItem('user');
//     const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
    
//     if (!currentUserId || notification.metadata?.senderId === currentUserId) return;

//     try {
//       const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//       audio.volume = 0.3;
      
//       const playPromise = audio.play();
//       if (playPromise !== undefined) {
//         playPromise.catch(() => {
//           if (audioRef.current) {
//             audioRef.current.currentTime = 0;
//             audioRef.current.play().catch(console.error);
//           }
//         });
//       }
//     } catch (e) {
//       console.error('Audio error:', e);
//     }
//   }, [soundEnabled]);

//   const connectWebSocket = useCallback(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.warn('No token found for WebSocket connection');
//       return null;
//     }

//     const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log('WebSocket connected successfully');
//       setSocket(ws);
//       setConnectionState('connected');
//       reconnectAttempts.current = 0;

//       // Fetch initial notifications
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       })
//       .then(res => {
//         setNotifications(res.data);
//         setUnreadCount(res.data.filter(n => !n.isRead).length);
//       })
//       .catch(err => console.warn('Failed to fetch notifications:', err));
//     };

//     ws.onmessage = (event) => {
//       try {
//         const { type, payload } = JSON.parse(event.data);
//         if (type === 'NOTIFICATION') {
//           setNotifications(prev => [payload, ...prev]);
//           setUnreadCount(prev => prev + 1);
//           playSound(payload);
//         }
//       } catch (err) {
//         console.error('Failed to process message:', err);
//       }
//     };

//     ws.onclose = (event) => {
//       console.log(`WebSocket closed: ${event.code} - ${event.reason || 'No reason'}`);
//       setSocket(null);
//       setConnectionState('disconnected');

//       // Reconnect only for abnormal closures
//       if (event.code !== WS_CLOSE_CODES.NORMAL) {
//         const baseDelay = Math.min(5000 * Math.pow(2, reconnectAttempts.current), 30000);
//         const jitter = Math.random() * 5000;
//         const delay = Math.min(baseDelay + jitter, 60000);
        
//         console.log(`Reconnecting in ${Math.round(delay/1000)}s...`);
//         reconnectAttempts.current += 1;
//         setTimeout(connectWebSocket, delay);
//       }
//     };

//     ws.onerror = (event) => {
//       const error = event.error || event;
//       console.error('WebSocket error:', error.message || 'Unknown error');
//       ws.close(WS_CLOSE_CODES.INTERNAL_ERROR, error.message);
//     };

//     return ws;
//   }, [playSound]);

//   // Connection management
//   useEffect(() => {
//     const ws = connectWebSocket();
    
//     // Health check
//     const healthCheckInterval = setInterval(() => {
//       if (ws?.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
//       }
//     }, 30000);

//     return () => {
//       ws?.close(WS_CLOSE_CODES.NORMAL, 'Component unmounting');
//       clearInterval(healthCheckInterval);
//     };
//   }, [connectWebSocket]);

//   const value = {
//     socket,
//     notifications,
//     unreadCount,
//     soundEnabled,
//     connectionState,
//     toggleSound: () => setSoundEnabled(!soundEnabled),
//     markAsRead: async (id) => {
//       try {
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`);
//         setNotifications(prev => 
//           prev.map(n => n.id === id ? {...n, isRead: true} : n)
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       } catch (err) {
//         console.error('Failed to mark as read:', err);
//       }
//     },
//     sendMessage: (message) => {
//       if (socket?.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(message));
//       } else {
//         console.warn('Cannot send message - WebSocket not connected');
//       }
//     }
//   };

//   return (
//     <WebSocketContext.Provider value={value}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// }

// export function useWebSocket() {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// }
// **********************************

// // HALISI
// 'use client';
// import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';

// export const WebSocketContext = createContext(null);

// export function WebSocketProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);
  
//   // Initialize audio element on component mount
//   // Add this to your WebSocketProvider component
//   useEffect(() => {
//     const handleFirstInteraction = () => {
//       // Initialize the audioRef on first user interaction
//       const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//       audio.volume = 0.3; // Set volume to 30%
//       audioRef.current = audio;
  
//       // Play and then stop it to unlock audio in strict browsers
//       audio.play().then(() => {
//         audio.pause();
//         audio.currentTime = 0;
//       }).catch(console.error);
  
//       // Remove event listener once the first interaction has occurred
//       document.removeEventListener('click', handleFirstInteraction);
//     };
  
//     // Listen for the user's first interaction to initialize the audio
//     document.addEventListener('click', handleFirstInteraction);
  
//     // Clean up the event listener when the component unmounts
//     return () => document.removeEventListener('click', handleFirstInteraction);
//   }, []);
  

//   const playSound = useCallback((notification) => {
//     // 1. Check if sound is enabled globally
//     if (!soundEnabled) return;
  
//     // 2. Get current user ID
//     const storedUser = localStorage.getItem('user');
//     const parsedUser = storedUser ? JSON.parse(storedUser) : null;
//     const currentUserId = parsedUser?.id;

//     // const currentUserId = user?.id;
//     if (!currentUserId) return;
  
//     // 3. Don't play if notification is from current user
//     console.log('Notification sender ID:', notification.metadata?.senderId);
//     console.log('Current user ID:', currentUserId);
//     if (notification.metadata?.senderId === currentUserId) return; 
//     console.log('Sound will play for this notification.');
//     // 4. Mobile-specific handling (now with more nuance)
//     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
//     if (isMobile) {
//       // Special handling for mobile instead of complete silence
//       try {
//         // Mobile browsers require this to be triggered by user gesture
//         const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//         audio.volume = 0.3;
        
//         // Some mobile browsers allow this if the user has interacted
//         audio.play().catch(e => {
//           console.log('Mobile audio blocked, showing visual feedback instead');
//           // Add visual feedback here (e.g., toast notification)
//         });
//         return;
//       } catch (e) {
//         console.log('Mobile audio error:', e);
//         return;
//       }
//     }

//     // 5. Desktop sound handling
//     try {
//       const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//       audio.volume = 0.3;
//       const playPromise = audio.play();
      
//       if (playPromise !== undefined) {
//         playPromise.catch(error => {
//           console.log('Standard audio failed, trying fallback...');
//           try {
//             if (audioRef.current) {
//               audioRef.current.currentTime = 0;
//               audioRef.current.play().catch(e => console.log('Fallback failed:', e));
//             } else {
//               console.warn('Audio ref is not ready yet. Skipping fallback sound.');
//             }            
//           } catch (e) {
//             console.log('Fallback error:', e);
//           }
//         });
//       }
//     } catch (e) {
//       console.log('Audio init error:', e);
//     }
//   }, [soundEnabled]);

//   const connectWebSocket = useCallback(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.warn('No token found. Skipping WebSocket connection.');
//       return null;
//     }
  
//     const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
//     const ws = new WebSocket(wsUrl);
  
//     ws.onopen = () => {
//       console.log('WebSocket Connected');
//       setSocket(ws);
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       }).then(res => {
//         setNotifications(res.data);
//         setUnreadCount(res.data.filter(n => !n.isRead).length);
//       }).catch(err => {
//         console.warn('Notification fetch failed:', err.message || err);
//       });
//     };
  
//     ws.onmessage = (event) => {
//       const { type, payload } = JSON.parse(event.data);
//       if (type === 'NOTIFICATION') {
//         setNotifications(prev => [payload, ...prev]);
//         setUnreadCount(prev => prev + 1);
//         playSound(payload);
//       }
//     };
  
//     ws.onclose = (event) => {
//       console.warn('WebSocket Disconnected:', event.reason);
//       setSocket(null);
//       setTimeout(() => connectWebSocket(), 5000); // reconnect delay
//     };
  
//     ws.onerror = (err) => {
//       console.error('WebSocket Error:', err.message);
//       ws.close(); // force disconnect to prevent flooding
//     };
  
//     return ws;
//   }, [playSound]);
  

//   useEffect(() => {
//     const ws = connectWebSocket();
//     return () => ws?.close();
//   }, [connectWebSocket]);

//   const value = {
//     socket,
//     notifications,
//     unreadCount,
//     soundEnabled,
//     toggleSound: () => setSoundEnabled(!soundEnabled),
//     markAsRead: async (id) => {
//       try {
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`);
//         setNotifications(prev => 
//           prev.map(n => n.id === id ? {...n, isRead: true} : n)
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       } catch (err) {
//         console.error('Error marking as read:', err);
//       }
//     },
//     sendMessage: (message) => {
//       if (socket?.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(message));
//       }
//     }
//   };

//   return (
//     <WebSocketContext.Provider value={value}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// }

// export function useWebSocket() {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// }

// xxxxxxxxxxxxxxxx
// NAKALA 
'use client';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

export const WebSocketContext = createContext(null);

const WS_CLOSE_CODES = {
  NORMAL: 1000,
  GOING_AWAY: 1001,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED: 1003,
  ABNORMAL: 1006,
  INTERNAL_ERROR: 4001//1011
};

export function WebSocketProvider({ children }) {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      // Initialize the audioRef on first user interaction
      const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
      audio.volume = 0.3; // Set volume to 30%
      audioRef.current = audio;
  
      // Play and then stop it to unlock audio in strict browsers
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(console.error);
  
      // Remove event listener once the first interaction has occurred
      document.removeEventListener('click', handleFirstInteraction);
    };
  
    // Listen for the user's first interaction to initialize the audio
    document.addEventListener('click', handleFirstInteraction);
  
    // Clean up the event listener when the component unmounts
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);
  
  const playSound = useCallback((notification) => {
    // 1. Check if sound is enabled globally
    if (!soundEnabled) return;
  
    // 2. Get current user ID
    const storedUser = localStorage.getItem('user');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

    
    // 3. Don't play if notification is from current user
    if (!currentUserId || notification.metadata?.senderId === currentUserId) return;
    // 4. Mobile-specific handling (now with more nuance)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Special handling for mobile instead of complete silence
      try {
        // Mobile browsers require this to be triggered by user gesture
        const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
        audio.volume = 0.3;
        
        // Some mobile browsers allow this if the user has interacted
        audio.play().catch(e => {
          console.log('Mobile audio blocked, showing visual feedback instead');
          // Add visual feedback here (e.g., toast notification)
        });
        return;
      } catch (e) {
        console.log('Mobile audio error:', e);
        return;
      }
    }

    // 5. Desktop sound handling
    try {
      const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
      audio.volume = 0.3;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Standard audio failed, trying fallback...');
          try {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.log('Fallback failed:', e));
            } else {
              console.warn('Audio ref is not ready yet. Skipping fallback sound.');
            }            
          } catch (e) {
            console.log('Fallback error:', e);
          }
        });
      }
    } catch (e) {
      console.log('Audio init error:', e);
    }
  }, [soundEnabled]);

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found. Skipping WebSocket connection.');
      return null;
    }
  
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
    const ws = new WebSocket(wsUrl);
  
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
      setConnectionState('connected');
      reconnectAttempts.current = 0;
      
      // Fetch initial notifications
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      })
      .catch(err => {
        console.warn('Notification fetch failed:', err.message || err);
      });
    };
  
    ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'NOTIFICATION') {
          setNotifications(prev => [payload, ...prev]);
          setUnreadCount(prev => prev + 1);
          playSound(payload);
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };
  
    ws.onclose = (event) => {
      console.log(`WebSocket Disconnected: Code ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
      setSocket(null);
      setConnectionState('disconnected');
      
      // Only reconnect if it wasn't a normal closure
      if (event.code !== WS_CLOSE_CODES.NORMAL) {
        const baseDelay = Math.min(5000 * Math.pow(2, reconnectAttempts.current), 30000);
        const jitter = Math.random() * 5000;
        const delay = Math.min(baseDelay + jitter, 60000);
        
        console.log(`Reconnecting in ${Math.round(delay/1000)}s...`);
        reconnectAttempts.current += 1;
        setTimeout(connectWebSocket, delay);
      }
      // if (event.code !== 1000) {
      //   const reconnectDelay = Math.min(5000 + Math.random() * 5000, 30000); // 5-10s with jitter
      //   console.log(`Attempting reconnect in ${Math.round(reconnectDelay/1000)}s...`);
      //   setTimeout(() => connectWebSocket(), reconnectDelay);
      // }
    };
  
    ws.onerror = (event) => {
      // Handle both Event and ErrorEvent types
      const errorMessage = event.message || event.reason || 'Unknown WebSocket error';
      // console.error('WebSocket Error:', errorMessage || 'Unknown error');
      
      // Close with appropriate code
      // ws.close(1011, errorMessage); // 1011 = Internal Error
      ws.close(WS_CLOSE_CODES.INTERNAL_ERROR, errorMessage); // 1011 = Internal Error
      // console.error('WebSocket Closed due to error:', errorMessage);
    };
  
    return ws;
  }, [playSound]);  

  // Connection management
  useEffect(() => {
    const ws = connectWebSocket();
    
    // Health check
    const healthCheckInterval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
      }
    }, 30000);

    return () => {
      ws?.close(WS_CLOSE_CODES.NORMAL, 'Component unmounting');
      clearInterval(healthCheckInterval);
    };
  }, [connectWebSocket]);
  // useEffect(() => {
  //   const ws = connectWebSocket();
  //   return () => ws?.close();
  // }, [connectWebSocket]);

  const value = {
    socket,
    notifications,
    unreadCount,
    soundEnabled,
    connectionState,
    toggleSound: () => setSoundEnabled(!soundEnabled),
    markAsRead: async (id) => {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setNotifications(prev => 
          prev.map(n => n.id === id ? {...n, isRead: true} : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    },
    sendMessage: (message) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else {
        console.warn('Cannot send message - WebSocket not connected');
      }
    }
  };
  // const value = {
  //   socket,
  //   notifications,
  //   unreadCount,
  //   soundEnabled,
  //   toggleSound: () => setSoundEnabled(!soundEnabled),
  //   markAsRead: async (id) => {
  //     try {
  //       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`);
  //       setNotifications(prev => 
  //         prev.map(n => n.id === id ? {...n, isRead: true} : n)
  //       );
  //       setUnreadCount(prev => Math.max(0, prev - 1));
  //     } catch (err) {
  //       console.error('Error marking as read:', err);
  //     }
  //   },
  //   sendMessage: (message) => {
  //     if (socket?.readyState === WebSocket.OPEN) {
  //       socket.send(JSON.stringify(message));
  //     }
  //   }
  // };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
// MWISHO NAKALA 
// *******************************************
// *******************************************


// 'use client';
// import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';

// export const WebSocketContext = createContext(null);

// export function WebSocketProvider({ children }) {
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const audioRef = useRef(null);
//   const userInteracted = useRef(false);

//   // Initialize audio element and handle user interaction
//   useEffect(() => {
//     const handleFirstInteraction = () => {
//       userInteracted.current = true;
//       // Preload audio
//       audioRef.current = new Audio('/mixkit-confirmation-tone-2867.wav');
//       audioRef.current.load();
//       document.removeEventListener('click', handleFirstInteraction);
//     };

//     document.addEventListener('click', handleFirstInteraction);
//     return () => {
//       document.removeEventListener('click', handleFirstInteraction);
//     };
//   }, []);

//   const playSound = useCallback(() => {
//     if (soundEnabled && userInteracted.current) {
//       try {
//         // Clone the audio element to allow multiple rapid plays
//         const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//         audio.volume = 0.3; // Reduce volume if needed
//         audio.play().catch(e => console.log('Audio play failed:', e));
//       } catch (e) {
//         console.log('Audio play error:', e);
//       }
//     }
//   }, [soundEnabled]);

//   const connectWebSocket = useCallback(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log('WebSocket Connected');
//       setSocket(ws);
//       // Load initial notifications
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       })
//         .then(res => {
//           setNotifications(res.data);
//           setUnreadCount(res.data.filter(n => !n.isRead).length);
//         });
//     };

//     ws.onmessage = (event) => {
//       const { type, payload } = JSON.parse(event.data);
//       if (type === 'NOTIFICATION') {
//         setNotifications(prev => [payload, ...prev]);
//         setUnreadCount(prev => prev + 1);
//         playSound();
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket Disconnected');
//       setTimeout(() => connectWebSocket(), 5000);
//     };

//     return ws;
//   }, [playSound]);

//   useEffect(() => {
//     const ws = connectWebSocket();
//     return () => ws?.close();
//   }, [connectWebSocket]);

//   const value = {
//     socket,
//     notifications,
//     unreadCount,
//     soundEnabled,
//     toggleSound: () => setSoundEnabled(!soundEnabled),
//     markAsRead: async (id) => {
//       try {
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`);
//         setNotifications(prev => 
//           prev.map(n => n.id === id ? {...n, isRead: true} : n)
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       } catch (err) {
//         console.error('Error marking as read:', err);
//       }
//     },
//     sendMessage: (message) => {
//       if (socket?.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(message));
//       }
//     }
//   };

//   return (
//     <WebSocketContext.Provider value={value}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// }

// export function useWebSocket() {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// }



// *****************************************
// 'use client';
// import { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import axios from 'axios';

// export const WebSocketContext = createContext(null);

// export function WebSocketProvider({ children }) {
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [soundEnabled, setSoundEnabled] = useState(true);

//   const playSound = useCallback(() => {
//     if (soundEnabled) {
//       const audio = new Audio('/mixkit-confirmation-tone-2867.wav');
//       audio.play().catch(e => console.log('Audio play failed:', e));
//     }
//   }, [soundEnabled]);

//   const connectWebSocket = useCallback(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log('WebSocket Connected');
//       setSocket(ws);
//       // Load initial notifications
//       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       })
//         .then(res => {
//           setNotifications(res.data);
//           setUnreadCount(res.data.filter(n => !n.isRead).length);
//         });
//     };

//     ws.onmessage = (event) => {
//       const { type, payload } = JSON.parse(event.data);
//       if (type === 'NOTIFICATION') {
//         setNotifications(prev => [payload, ...prev]);
//         setUnreadCount(prev => prev + 1);
//         playSound();
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket Disconnected');
//       setTimeout(() => connectWebSocket(), 5000);
//     };

//     return ws;
//   }, [playSound]);

//   useEffect(() => {
//     const ws = connectWebSocket();
//     return () => ws?.close();
//   }, [connectWebSocket]);

//   const value = {
//     socket,
//     notifications,
//     unreadCount,
//     soundEnabled,
//     toggleSound: () => setSoundEnabled(!soundEnabled),
//     markAsRead: async (id) => {
//       try {
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`);
//         setNotifications(prev => 
//           prev.map(n => n.id === id ? {...n, isRead: true} : n)
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       } catch (err) {
//         console.error('Error marking as read:', err);
//       }
//     },
//     sendMessage: (message) => {
//       if (socket?.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(message));
//       }
//     }
//   };

//   return (
//     <WebSocketContext.Provider value={value}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// }

// // ************************************

// 'use client';
// import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// export const WebSocketContext = createContext(null);

// export function WebSocketProvider({ children }) {
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const connectWebSocket = useCallback(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log('WebSocket Connected');
//       setSocket(ws);
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === 'NOTIFICATION') {
//         setNotifications(prev => [message.payload, ...prev]);
//         setUnreadCount(prev => prev + 1);
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket Disconnected');
//       setTimeout(() => connectWebSocket(), 5000); // Reconnect after 5s
//     };

//     return ws;
//   }, []);

//   useEffect(() => {
//     const ws = connectWebSocket();
//     return () => ws?.close();
//   }, [connectWebSocket]);

//   const value = {
//     socket,
//     notifications,
//     unreadCount,
//     markAsRead: (id) => {
//       setNotifications(prev => 
//         prev.map(n => n.id === id ? {...n, read: true} : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     },
//     sendMessage: (message) => {
//       if (socket?.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(message));
//       }
//     }
//   };

//   return (
//     <WebSocketContext.Provider value={value}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// }

// export function useWebSocket() {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// }