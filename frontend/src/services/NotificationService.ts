import axios from 'axios';
import { Notification } from '../types';

export const getNotifications = async (userId: number): Promise<Notification[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://localhost:3003/notifications/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};