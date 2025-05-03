'use client';
import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../lib/WebSocketContext';
import { FaBell, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function NotificationBell({style}) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead,
    soundEnabled,
    toggleSound
  } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="relative" ref={popupRef}>
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleSound}
          className="p-1 text-gray-500 hover:text-gray-700"
          title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
        >
          {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
        >
          <FaBell className="text-lg" style={style}/>
          {unreadCount > 0 && (
            <span className={`absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center
    ${unreadCount > 19 ? 'text-[0.6rem]' : 'text-xs'}`}>
              {unreadCount > 19 ? '19+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <span className="text-xs text-gray-500">
              {unreadCount > 19 ? '19+' : unreadCount} unread
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer 
                    ${!notification.isRead ? 'bg-blue-50 dark:bg-gray-700' : ''}
                    hover:bg-gray-100 dark:hover:bg-gray-600`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{notification.title}</p>
                    {notification.type === 'urgent' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}



// 'use client';
// import { useState } from 'react';
// import { useWebSocket } from '../lib/WebSocketContext';
// import { FaBell } from 'react-icons/fa';

// export default function NotificationBell({ style }) {
//   const { notifications, unreadCount, markAsRead } = useWebSocket();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//       >
//         <FaBell className="text-lg" style={style}  />
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
//           <div className="p-2 border-b border-gray-200 dark:border-gray-700">
//             <h3 className="font-medium">Notifications</h3>
//           </div>
//           <div className="max-h-80 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <p className="p-4 text-center text-gray-500">No notifications</p>
//             ) : (
//               notifications.map(notification => (
//                 <div 
//                   key={notification.id}
//                   className={`p-3 border-b border-gray-100 dark:border-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
//                   onClick={() => {
//                     markAsRead(notification.id);
//                     // Add navigation logic if needed
//                   }}
//                 >
//                   <p className="font-medium">{notification.title}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     {notification.message}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {new Date(notification.timestamp).toLocaleTimeString()}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }