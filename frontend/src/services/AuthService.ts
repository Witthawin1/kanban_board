import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await axios.post('http://localhost:3001/auth/login', credentials);
  return response.data.token;
};

export const register = async (credentials: RegisterCredentials): Promise<string> => {
  const response = await axios.post('http://localhost:3001/auth/register', credentials);
  return response.data.token;
};

export const getTokenData = async () => {
    const token = localStorage.getItem('token')
    if(!token) return null

    try {
        const parts = token.split('.')
        if (parts.length !== 3) {
            console.error("Invalid JWT format");
            return null;
        }

        const payloadBase64 = parts[1];
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}