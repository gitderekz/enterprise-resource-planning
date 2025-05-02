// hooks/useNotifications.js
const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const socket = useWebSocket();
  
    const markAsRead = (id) => {
      setNotifications(prev => 
        prev.map(n => n._id === id ? {...n, isRead: true} : n)
      );
      socket.emit('mark-read', id);
    };
  
    return { notifications, markAsRead };
  };