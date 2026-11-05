import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    s.on('connect', () => {
      setIsConnected(true);
      if (user?._id) {
        s.emit('join_user_room', user._id);
        if (user.role === 'provider' && user.providerId) {
          s.emit('join_provider_room', {
            providerId: user.providerId,
            locality: user.addresses?.[0]?.locality || 'Indiranagar'
          });
        }
      }
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('new_notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      s.off('connect');
      s.off('disconnect');
      s.off('new_notification');
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
