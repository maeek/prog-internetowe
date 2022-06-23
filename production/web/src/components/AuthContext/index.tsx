import { createContext, useCallback, useLayoutEffect, useState } from "react";
import { fetchHelper } from "../../utils/fetch";

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'mod' | 'user';
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  mounted: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setIsAuthenticated(true);
      setToken(token);
      setUser(JSON.parse(user));
    }

    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await fetchHelper('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (data && data.access_token) {
      const user = JSON.parse(atob(data.access_token.split('.')[1]));
      setIsAuthenticated(true);
      setToken(data.access_token);
      setUser(user);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return data?.user;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const value: AuthContextType = {
    mounted,
    isAuthenticated,
    token,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};
