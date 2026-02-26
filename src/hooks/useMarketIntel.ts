import { useState, useCallback } from 'react';
import { mercadoLivreService } from '../services/MercadoLivreService';
import type { TrendKeyword, TrendItem } from '../services/MercadoLivreService';

export function useMarketIntel() {
    const [trends, setTrends] = useState<TrendKeyword[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<TrendItem[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const loadTrends = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const results = await mercadoLivreService.fetchTopTrends();
            setTrends(results);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro inesperado ao buscar as tendências.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadProducts = useCallback(async (keyword: string) => {
        setIsLoadingProducts(true);
        setError(null);

        try {
            const results = await mercadoLivreService.fetchProductsByKeyword(keyword);
            setProducts(results);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro inesperado ao buscar os produtos.');
            }
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    return {
        trends, loadTrends, isLoading,
        products, loadProducts, isLoadingProducts,
        error
    };
}
