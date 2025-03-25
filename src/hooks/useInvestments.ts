import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Investment {
    id: number;
    package_name: string;
    amount_crypto: number;
    amount_usd: number;
    currency: string;
    start_date: string;
    end_date: string;
    current_value_crypto: number;
    current_value_usd: number;
    daily_roi: number[];
    status: 'active' | 'completed' | 'cancelled';
    auto_compound: boolean;
}

export function useInvestments() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInvestments = async () => {
        try {
            const token = Cookies.get('auth-token');
            const response = await fetch('/api/investments/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setInvestments(data.investments);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load investments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    return { investments, isLoading, error, refetch: fetchInvestments };
}