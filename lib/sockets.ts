import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SOCKET_URL = 'your-laravel-backend-url';

export const initSocket = async () => {
  const token = await SecureStore.getItemAsync('auth_token');
  
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });
};

export const setupSocketListeners = (socket, store) => {
  socket.on('location-update', (data) => {
    store.updateDriverLocation(data.location);
  });

  socket.on('status-update', (data) => {
    store.updateChildStatus(data.childId, data.newStatus);
  });
};