import React from 'react';
import { Loader2, AlertCircle, TrendingUp, RefreshCw, ArrowLeft, DollarSign, ArrowDownRight, ArrowUpRight, Flame, Search } from 'lucide-react';
import type { TrendKeyword, TrendItem } from '../services/MercadoLivreService';

export interface DashboardViewProps {
    trends: TrendKeyword[];
    isLoadingTrends: boolean;
    selectedTrend: string | null;
    onSelectTrend: (keyword: string) => void;
    onClearSelection: () => void;
    products: TrendItem[];
    isLoadingProducts: boolean;
    stats: { avg: number; min: number; max: number } | null;
    error: string | null;
    onRefreshTrends: () => void;
    manualSearch?: string;
    setManualSearch?: (val: string) => void;
    handleManualSearch?: (e: React.FormEvent) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    trends, isLoadingTrends, selectedTrend, onSelectTrend, onClearSelection,
    products, isLoadingProducts, stats, error, onRefreshTrends,
    manualSearch, setManualSearch, handleManualSearch
}) => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 tracking-tight">
                    <TrendingUp className="text-blue-600 w-8 h-8" /> Radar de Tendências
                </h2>

                {!selectedTrend && (
                    <div className="flex w-full md:w-auto gap-2">
                        <form onSubmit={handleManualSearch} className="flex w-full md:w-auto gap-2">
                            <div className="flex">
                                <div className="relative w-full md:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        placeholder="Ou busque um nicho..."
                                        value={manualSearch}
                                        onChange={(e) => setManualSearch && setManualSearch(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
                                    Buscar
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={onRefreshTrends}
                            disabled={isLoadingTrends}
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 w-10 h-10 rounded-lg hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-75"
                        >
                            {isLoadingTrends ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                        </button>
                    </div>
                )}

                {selectedTrend && (
                    <button
                        onClick={onClearSelection}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para Tendências
                    </button>
                )}
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start space-x-3 mt-4">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* --- MASTER VIEW: TRENDING LIST --- */}
            {!selectedTrend && (
                <div className="max-w-4xl mx-auto">
                    {/* Loading State when empty */}
                    {isLoadingTrends && trends.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-500 font-medium animate-pulse">Varrendo o Mercado Livre em tempo real...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoadingTrends && !error && trends.length === 0 && (
                        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500">Nenhuma tendência encontrada no momento.</p>
                        </div>
                    )}

                    {/* Ranked List */}
                    {trends.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
                            <ul className="divide-y divide-gray-100">
                                {trends.map((item) => (
                                    <li
                                        key={item.rank}
                                        onClick={() => onSelectTrend(item.keyword)}
                                        className="p-4 hover:bg-gray-50 flex items-center group transition-colors cursor-pointer"
                                    >
                                        <span className={`flex items-center justify-center font-black text-lg w-10 h-10 rounded-full mr-5 shadow-sm
                                            ${item.rank === 1 ? 'bg-amber-100 text-amber-600' :
                                                item.rank === 2 ? 'bg-slate-100 text-slate-500' :
                                                    item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-50 text-gray-400'}`}>
                                            #{item.rank}
                                        </span>
                                        <span className="text-lg font-medium text-gray-800 capitalize flex-1 group-hover:text-blue-600 transition-colors">
                                            {item.keyword}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* --- DETAIL VIEW: PRODUCTS GRID --- */}
            {selectedTrend && (
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-gray-900 capitalize italic border-l-4 border-orange-500 pl-4 my-6">
                        {selectedTrend}
                    </h2>

                    {/* Market Intelligence Insights */}
                    {!isLoadingProducts && stats && products.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                                <div className="p-3 bg-blue-50 rounded-full">
                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Ticket Médio</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.avg)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                                <div className="p-3 bg-green-50 rounded-full">
                                    <ArrowDownRight className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Menor Preço</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.min)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                                <div className="p-3 bg-red-50 rounded-full">
                                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Maior Preço</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.max)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoadingProducts ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
                            <p className="text-gray-500 font-medium animate-pulse">Minerando produtos em destaque para "{selectedTrend}"...</p>
                        </div>
                    ) : products.length === 0 && !error ? (
                        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500">Nenhum produto encontrado para esse nicho.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {products.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden group">
                                        <img
                                            src={item.imageUrl.replace('-I.jpg', '-O.jpg')}
                                            alt={item.title}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = item.imageUrl;
                                            }}
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-lg font-medium text-gray-800 line-clamp-2 leading-tight mb-2 flex-1" title={item.title}>
                                            {item.title}
                                        </h3>

                                        {item.salesText && (
                                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold mb-3 self-start shadow-sm bg-yellow-400 text-gray-900">
                                                <Flame className="w-3.5 h-3.5" />
                                                <span>{item.salesText}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                            </span>
                                            <a
                                                href={item.productUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm px-3 py-1.5 rounded-full font-medium transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100"
                                            >
                                                Ver no ML
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
