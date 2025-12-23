import { useQuery } from 'react-query';
import api from '../api';

/**
 * Custom hook to fetch and auto-refresh balance every 30 seconds
 */
export function useBalance() {
    return useQuery(
        'balance',
        async () => {
            const response = await api.get('/user/balance');
            return response.data;
        },
        {
            refetchInterval: 30000, // 30 seconds
            staleTime: 29000,
            retry: 2,
        }
    );
}
