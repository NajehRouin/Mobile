// src/context/AuthContext.js
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load token from AsyncStorage
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken);
    };

    loadToken();
  }, []);

  const login = async newToken => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    // Clear the token from both state and AsyncStorage
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{token, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
