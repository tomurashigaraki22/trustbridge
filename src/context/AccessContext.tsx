'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface AccessCodeContextType {
  isVerified: boolean;
  verifyCode: (code: string, returnPath?: string) => boolean;
  previousPath: string | null;
}

const AccessCodeContext = createContext<AccessCodeContextType | undefined>(undefined);

export function AccessCodeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const checkAccess = () => {
    if (process.env.NEXT_PUBLIC_IS_ACCESS_KEY === 'true') {
      return !!Cookies.get('access-code-verified');
    }
    return true;
  };

  const verifyCode = (inputCode: string, returnPath?: string) => {
    if (inputCode === process.env.NEXT_PUBLIC_ACCESS_CODE) {
      Cookies.set('access-code-verified', 'true', { expires: 30 });  
      if (returnPath && returnPath !== '/access') {
        router.push(returnPath);
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_IS_ACCESS_KEY === 'true') {
      const isVerified = Cookies.get('access-code-verified');
      if (!isVerified && pathname !== '/access') {
        Cookies.set('previous-path', pathname);
        router.push('/access');
      }
    }
  }, [pathname, router]);

  // Check access code expiration
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (!checkAccess() && pathname !== '/access') {
        Cookies.set('previous-path', pathname);
        router.push('/access');
      }
    }, 1000); // Check every second

    return () => clearInterval(checkInterval);
  }, [pathname, router]);

  const contextValue = {
    isVerified: checkAccess(),
    verifyCode,
    previousPath: Cookies.get('previous-path') || '/'
  };

  return (
    <AccessCodeContext.Provider value={contextValue}>
      {children}
    </AccessCodeContext.Provider>
  );
}

export const useAccessCode = () => {
  const context = useContext(AccessCodeContext);
  if (context === undefined) {
    throw new Error('useAccessCode must be used within an AccessCodeProvider');
  }
  return context;
};