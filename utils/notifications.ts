import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  return token;
};

// Save notification to AsyncStorage
export const saveNotification = async (notification: {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'dropoff' | 'problem';
  driver: string;
  vehicle: string;
}) => {
  try {
    const existingNotifications = await AsyncStorage.getItem('parent_notifications');
    const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
    
    // Add new notification to the beginning of the array
    notifications.unshift(notification);
    
    // Save updated notifications
    await AsyncStorage.setItem('parent_notifications', JSON.stringify(notifications));
    
    return true;
  } catch (error) {
    console.error('Error saving notification:', error);
    return false;
  }
};

// Send local notification
export const sendLocalNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // null means show immediately
  });
};

// Send dropoff notification
export const sendDropoffNotification = async (studentName: string, driverName: string, vehicle: string) => {
  const notificationId = Date.now().toString();
  const timestamp = new Date().toLocaleString();
  
  // Save to AsyncStorage
  await saveNotification({
    id: notificationId,
    title: 'Estudiante Recogido',
    message: `${studentName} ha sido recogido por ${driverName} en el vehículo ${vehicle}`,
    timestamp,
    read: false,
    type: 'dropoff',
    driver: driverName,
    vehicle,
  });
  
  // Send local notification
  await sendLocalNotification(
    'Estudiante Recogido',
    `${studentName} ha sido recogido por ${driverName} en el vehículo ${vehicle}`
  );
  
  return notificationId;
};

// Send dropoff at destination notification
export const sendDropoffAtDestinationNotification = async (studentName: string, driverName: string, vehicle: string, destination: string) => {
  const notificationId = Date.now().toString();
  const timestamp = new Date().toLocaleString();
  
  // Save to AsyncStorage
  await saveNotification({
    id: notificationId,
    title: 'Estudiante Entregado',
    message: `${studentName} ha sido entregado en ${destination} por ${driverName} en el vehículo ${vehicle}`,
    timestamp,
    read: false,
    type: 'dropoff',
    driver: driverName,
    vehicle,
  });
  
  // Send local notification
  await sendLocalNotification(
    'Estudiante Entregado',
    `${studentName} ha sido entregado en ${destination} por ${driverName} en el vehículo ${vehicle}`
  );
  
  return notificationId;
};

// Send problem notification
export const sendProblemNotification = async (problem: string, driverName: string, vehicle: string) => {
  const notificationId = Date.now().toString();
  const timestamp = new Date().toLocaleString();
  
  // Save to AsyncStorage
  await saveNotification({
    id: notificationId,
    title: 'Problema Reportado por el Conductor',
    message: problem,
    timestamp,
    read: false,
    type: 'problem',
    driver: driverName,
    vehicle,
  });
  
  // Send local notification
  await sendLocalNotification(
    'Problema Reportado',
    `${driverName} ha reportado un problema: ${problem}`
  );
  
  return notificationId;
}; 