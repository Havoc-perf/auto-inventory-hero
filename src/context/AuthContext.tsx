
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/utils/types';
import { users } from '@/utils/dummyData';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  companyInfo: {
    name: string;
    logo: string;
  };
  updateCompanyInfo: (info: { name: string; logo: string }) => void;
}

const defaultCompanyInfo = {
  name: 'Auto Parts Store',
  logo: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  companyInfo: defaultCompanyInfo,
  updateCompanyInfo: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [companyInfo, setCompanyInfo] = useState(() => {
    const savedInfo = localStorage.getItem('companyInfo');
    return savedInfo ? JSON.parse(savedInfo) : defaultCompanyInfo;
  });
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would validate against a backend API
    // For demo purposes, we'll use the dummy data
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast.success(`Bienvenue, ${foundUser.name}!`);
      return true;
    }
    
    toast.error('Email ou mot de passe incorrect');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Vous avez été déconnecté');
  };

  const updateCompanyInfo = (info: { name: string; logo: string }) => {
    setCompanyInfo(info);
    localStorage.setItem('companyInfo', JSON.stringify(info));
    toast.success('Informations de l\'entreprise mises à jour');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated, 
        isAdmin,
        companyInfo,
        updateCompanyInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
