import axios from 'axios';
import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'android'
    ? 'http://192.168.0.120:5000/api'
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
