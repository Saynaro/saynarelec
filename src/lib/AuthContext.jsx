import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Публичный сайт — не требует аутентификации.
// Авторизация администратора обрабатывается в ContentProvider (content.jsx).
export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      authChecked: true,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
