import axios from 'axios';
import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.0.120:5000'
    : 'http://localhost:5000';

const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
