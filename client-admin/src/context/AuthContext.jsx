import { createContext, useState, useContext } from "react";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export function AuthProvider({children}){
    const [token, setToken] = useState(()=> localStorage.getItem('token') || null);

    const login = async (username, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = {token, login, logout};

    return <AuthContext.Provider value={value}>{children}  </AuthContext.Provider>;
}

// custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}