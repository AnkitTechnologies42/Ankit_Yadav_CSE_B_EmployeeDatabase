
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let mockUsers = [
  { username: 'admin', password: 'admin123', isAdmin: true },
  { username: 'user', password: 'user123', isAdmin: false },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call with mock data
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = {
        username: foundUser.username,
        isAdmin: foundUser.isAdmin,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Logged in successfully');
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    // Check if username already exists
    const userExists = mockUsers.some(u => u.username === username);
    
    if (userExists) {
      toast.error('Username already exists');
      return false;
    }
    
    // Create new user
    const newUser = {
      username,
      password,
      isAdmin: false, // New users are not admins by default
    };
    
    // Add to mock users
    mockUsers = [...mockUsers, newUser];
    
    // Auto login after registration
    const userData = {
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success('Account created successfully');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
