import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface UserData {
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string;
    phone_number: string | null;
    country: string | null;
    status: 'active' | 'suspended' | 'pending' | 'blocked';
    kyc_status: 'none' | 'pending' | 'verified' | 'rejected';
    two_factor_enabled: boolean;
    last_login: string;
    login_ip: string;
    btc_balance: number;
    eth_balance: number;
    usdt_balance: number;
    bnb_balance: number;
    xrp_balance: number;
    ada_balance: number;
    doge_balance: number;
    sol_balance: number;
    dot_balance: number;
    matic_balance: number;
    link_balance: number;
    uni_balance: number;
    avax_balance: number;
    ltc_balance: number;
    shib_balance: number;
    created_at: string;
    updated_at: string;
    unreadNotices: number;
    is_admin: boolean;
    otp_status: string;
    otp_code: string;
    total_deposit: number;
    total_withdrawals: number;
    total_trades: number;
    total_p2p: number;
    total_profit: number;

  };
  notices: {
    id: number;
    type: 'security' | 'transaction' | 'kyc' | 'system' | 'promotion';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }[];
  kycDocuments: {
    id: number;
    document_type: 'passport' | 'national_id' | 'drivers_license' | 'proof_of_address';
    document_number: string | null;
    status: 'pending' | 'verified' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
  }[];
  wallets: {
    id: number;
    currency: string;
    address: string;
    label: string | null;
    is_default: boolean;
    balance: number;
    created_at: string;
  }[];
  transactions: {
    id: number;
    user_id: number;
    type: 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'p2p' | 'others';
    currency: string;
    amount: number;
    fee: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    from_address: string;
    to_address: string;
    tx_hash: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[];
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateTotalBalance = (data: UserData) => {
    const balances = [
      data.user.btc_balance
    ];

    const total = balances.reduce((sum, balance) => sum + (Number(balance) || 0), 0);
    return Number(total.toFixed(2)); // Format to 2 decimal places
  };

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('auth-token');
      if (!token) return;

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      // console.log('fetched user data')
      setUserData(data);
      setTotalBalance(calculateTotalBalance(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    userData,
    isLoading,
    error,
    refetch: fetchUserData,
    totalBalance
  };
}