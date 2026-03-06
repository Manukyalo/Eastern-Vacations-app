import Constants from 'expo-constants';

// Dynamically connect to the developer's computer IP or fallback
const HOST_IP = Constants.expoConfig?.hostUri?.split(':')[0] || '192.168.0.101';

export const API_URL = `http://${HOST_IP}:3000/api`;
