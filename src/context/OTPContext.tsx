'use client';

import { createContext, useContext, ReactNode } from 'react';
 
interface OTPContextType {
    checkOTPColumns: () => Promise<void>;
}

const OTPContext = createContext<OTPContextType | null>(null);

export function OTPProvider({ children }: { children: ReactNode }) {
     const checkOTPColumns = async () => {
        try {
             await fetch(`/api/check-otp-columns`, {
                method: 'GET',
                cache: 'no-store'
            });
        } catch (error) {
 
            console.error('Error checking OTP columns:', error);
        }
    };
    checkOTPColumns();
    return (
        <OTPContext.Provider value={{
            checkOTPColumns
        }}>
            {children}
        </OTPContext.Provider>
    );
}

export const useOTP = () => {
    const context = useContext(OTPContext);
    if (!context) {
        throw new Error('useOTP must be used within an OTPProvider');
    }
    return context;
};