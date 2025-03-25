'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Update User interface
interface User {
  id: number;
  email: string;
  is_admin?: boolean;
}

interface Notice {
  id: string;
  is_read: boolean;
}

interface UserData {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    btc_balance: string;
    eth_balance: string;
    usdt_balance: string;
    bnb_balance: string;
    created_at: string;
    otp_status: string;
    otp_code: string | null;
  };
  notices: Notice[];
}

// Update AuthContextType interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;  // Add this line
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    country: string
  ) => Promise<void>;
  logout: () => void;
  userData: UserData | null;  // Update this line
  refreshUserData: () => Promise<void>;
  markNoticesAsRead: (noticeIds: number[]) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);  // Update this line
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth-token');
    if (token) {
      // Verify token and get user data
      verifyAuth(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyAuth = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data: { user: User; error?: string; requireLogout?: boolean } = await response.json();  // Add type here

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
         setIsAdmin(data.user.is_admin || false);  // Add this line
      }
      else if (data.requireLogout) {
        logout();
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            message: data.error,
            type: 'error'
          }
        }));
      } else {
        Cookies.remove('auth-token');
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      Cookies.remove('auth-token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      Cookies.set('auth-token', data.token, { expires: 7 });
      setUser(data.user);
      setIsAuthenticated(true);

      // Modified navigation logic
      const destination = data.user.is_admin ? '/admin' : '/dashboard';
      router.push(destination);

      setTimeout(() => {
        if (window.location.pathname !== destination) {
          window.location.href = destination;
        }
      }, 500);

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    country: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          phone_number,
          country
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      Cookies.set('auth-token', data.token, { expires: 7 });
      setUser(data.user);
      setIsAuthenticated(true);

      // Modified navigation logic
      router.push('/dashboard/otp');

      // Force reload after a short delay if still on the same page
      setTimeout(() => {
        if (window.location.pathname !== '/dashboard/otp') {
          window.location.href = '/dashboard/otp';
        }
      }, 500);

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    Cookies.remove('auth-token');
    setUser(null);
    setIsAuthenticated(false);

    const destination = '/login';
    router.push(destination);

    setTimeout(() => {
      if (window.location.pathname !== destination) {
        window.location.href = destination;
      }
    }, 500);
  };

  const refreshUserData = async () => {
    try {
      const token = Cookies.get('auth-token');
      if (!token || !isAuthenticated) return;

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const markNoticesAsRead = async (noticeIds: number[]) => {
    try {
      const token = Cookies.get('auth-token');
      if (!token || !isAuthenticated) return;

      const response = await fetch('/api/notices/read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noticeIds }),
      });

      if (response.ok) {
        setUserData((prev: UserData | null) => {
          if (!prev || !prev.notices) return prev;

          return {
            ...prev,
            notices: prev.notices.map((notice) =>
              noticeIds.includes(Number(notice.id)) ? { ...notice, is_read: true } : notice
            )
          };
        });
        await refreshUserData();
      }
    } catch (error) {
      console.error('Failed to mark notices as read:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      isAdmin,  
      login,
      signup,
      logout,
      userData,
      refreshUserData,
      markNoticesAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};