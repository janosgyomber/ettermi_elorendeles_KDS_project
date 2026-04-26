import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = async (username, password) => {
    const basicToken = 'Basic ' + window.btoa(username + ':' + password);
    
    const response = await fetch(`/api/users/username/${username}`, {
      headers: {
        'Authorization': basicToken
      }
    });

    if (!response.ok) {
      throw new Error('Hibás bejelentkezési adatok!');
    }

    const userData = await response.json();
    
    setUser(userData);
    setToken(basicToken);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', basicToken);

    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
