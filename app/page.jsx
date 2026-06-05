'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import InfoModal from '@/components/InfoModal';

export default function HomePage() {
    const [grupos, setGrupos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [activeGrupoId, setActiveGrupoId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // Load groups once
    useEffect(() => {
        fetch('/api/grupos')
            .then((r) => r.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.data ?? [];
                setGrupos(list);
            })
            .catch(console.error);
    }, []);

    // Load products when group or search changes
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearch) {
            params.set('nome', debouncedSearch);
        } else if (activeGrupoId) {
            params.set('grupo_id', activeGrupoId);
        }
        fetch(`/api/produtos?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.data ?? [];
                setProdutos(list.filter((p) => p.grupo_id));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [activeGrupoId, debouncedSearch]);

    // When user types, clear category filter
    function handleSearchChange(value) {
        setSearchQuery(value);
        if (value) setActiveGrupoId(null);
    }

    function handleCategorySelect(id) {
        setActiveGrupoId(id);
        setSearchQuery('');
    }

    const isSearching = debouncedSearch.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onCartClick={() => setCartOpen(true)}
                onInfoClick={() => setInfoOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />

            <CategoryFilter
                grupos={grupos}
                activeId={activeGrupoId}
                onSelect={handleCategorySelect}
            />

            <main className="max-w-5xl mx-auto px-4 py-6">
                {/* Search result header */}
                {isSearching && (
                    <div className="mb-4">
                        {loading ? (
                            <p className="text-sm text-gray-500">Buscando "{debouncedSearch}"...</p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                <strong>{produtos.length}</strong> resultado{produtos.length !== 1 ? 's' : ''} para{' '}
                                <strong>"{debouncedSearch}"</strong>
                            </p>
                        )}
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="bg-gray-200 aspect-square" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Products grid */}
                {!loading && produtos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {produtos.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={setSelectedProduct}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && produtos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-6xl mb-4">🔍</span>
                        <p className="text-gray-600 font-semibold text-lg">
                            {isSearching
                                ? `Nenhum produto encontrado para "${debouncedSearch}"`
                                : 'Nenhum produto disponível nesta categoria'}
                        </p>
                        {isSearching && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="mt-4 text-amber-600 font-semibold hover:underline text-sm"
                            >
                                Limpar busca
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Modals & Drawers */}
            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {cartOpen && (
                <CartDrawer
                    onClose={() => setCartOpen(false)}
                />
            )}

            {infoOpen && (
                <InfoModal onClose={() => setInfoOpen(false)} />
            )}
        </div>
    );
}
