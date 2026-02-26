export interface TrendKeyword {
    rank: number;
    keyword: string;
}

export interface TrendItem {
    id: string;
    title: string;
    price: number;
    productUrl: string;
    imageUrl: string;
    salesCount?: number;
    salesText?: string;
    source: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class MercadoLivreService {
    public async fetchTopTrends(): Promise<TrendKeyword[]> {
        try {
            const response = await fetch(`${API_URL}/api/top-trends`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching top trends from Mercado Livre:', error);
            return [];
        }
    }

    public async fetchProductsByKeyword(keyword: string): Promise<TrendItem[]> {
        try {
            const response = await fetch(`${API_URL}/api/products?keyword=${encodeURIComponent(keyword)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching products from Mercado Livre:', error);
            return [];
        }
    }
}

export const mercadoLivreService = new MercadoLivreService();
