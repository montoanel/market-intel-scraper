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
        setProducts([]); // Passo 2: Zera imediatamente ao iniciar nova busca
        setIsLoadingProducts(true);
        setError(null);

        try {
            const data = await mercadoLivreService.fetchProductsByKeyword(keyword);

            // Mágica: Remove duplicatas baseadas no link único do produto
            const seenLinks = new Set<string>();
            const uniqueData = data.filter(item => {
                if (seenLinks.has(item.productUrl)) return false;
                seenLinks.add(item.productUrl);
                return true;
            });

            setProducts(uniqueData);
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
