import React, { useEffect, useState, useMemo } from 'react';
import { useMarketIntel } from '../hooks/useMarketIntel';
import { DashboardView } from '../views/DashboardView';

export const DashboardContainer: React.FC = () => {
    const {
        trends, loadTrends, isLoading,
        products, loadProducts, isLoadingProducts,
        error
    } = useMarketIntel();

    const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
    const [manualSearch, setManualSearch] = useState('');

    useEffect(() => {
        loadTrends();
    }, [loadTrends]);

    const handleSelectTrend = (keyword: string) => {
        setSelectedTrend(keyword);
        loadProducts(keyword);
    };

    const handleClearSelection = () => {
        setSelectedTrend(null);
    };

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualSearch.trim()) {
            handleSelectTrend(manualSearch.trim());
        }
    };

    const stats = useMemo(() => {
        if (!products || products.length === 0) return null;
        const prices = products.map(p => p.price);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return { avg, min, max };
    }, [products]);

    return (
        <DashboardView
            trends={trends}
            isLoadingTrends={isLoading}
            selectedTrend={selectedTrend}
            onSelectTrend={handleSelectTrend}
            onClearSelection={handleClearSelection}
            products={products}
            isLoadingProducts={isLoadingProducts}
            stats={stats}
            error={error}
            onRefreshTrends={loadTrends}
            manualSearch={manualSearch}
            setManualSearch={setManualSearch}
            handleManualSearch={handleManualSearch}
        />
    );
};
