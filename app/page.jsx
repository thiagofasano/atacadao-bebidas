'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchGrupos, fetchProdutos, fetchDestaquesIds } from '@/lib/actions';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import CartDrawer from '@/components/CartDrawer';
import InfoModal from '@/components/InfoModal';
import Footer from '@/components/Footer';

export default function HomePage() {
    const [grupos, setGrupos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [destaquesIds, setDestaquesIds] = useState([]);
    // filterGrupoId: categoria selecionada pelo clique (null = mostrar todas agrupadas)
    const [filterGrupoId, setFilterGrupoId] = useState(null);
    // scrollGrupoId: categoria destacada no nav conforme scroll (apenas na home)
    const [scrollGrupoId, setScrollGrupoId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    const sectionRefs = useRef({});

    function isIndisponivel(p) {
        const semEstoque = p.movimenta_estoque === '1' && parseFloat(p.estoque ?? 1) <= 0;
        return p.ativo === '0' || semEstoque;
    }

    function sortAvailableFirst(list) {
        return [...list].sort((a, b) => Number(isIndisponivel(a)) - Number(isIndisponivel(b)));
    }

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // Load groups and all products once
    useEffect(() => {
        fetchGrupos().then(setGrupos).catch(console.error);
    }, []);

    useEffect(() => {
        fetchDestaquesIds().then(setDestaquesIds).catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchProdutos()
            .then(setProdutos)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Group products by categoria in the same order as grupos array
    const groups = useMemo(() => {
        const map = {};
        produtos.forEach((p) => {
            if (!map[p.grupo_id]) map[p.grupo_id] = [];
            map[p.grupo_id].push(p);
        });
        return grupos
            .map((g) => ({ grupo: g, items: sortAvailableFirst(map[g.id] || []) }))
            .filter((g) => g.items.length > 0);
    }, [grupos, produtos]);

    const maisVendidos = useMemo(() => {
        if (destaquesIds.length === 0 || produtos.length === 0) return [];
        const map = {};
        produtos.forEach((p) => { map[Number(p.id)] = p; });
        return destaquesIds.map((id) => map[id]).filter(Boolean);
    }, [destaquesIds, produtos]);

    const isHomeView = !debouncedSearch && filterGrupoId === null;

    // Products filtered by active category or search
    const filteredProdutos = useMemo(() => {
        if (debouncedSearch) {
            const normalize = (s) => s?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const q = normalize(debouncedSearch);
            return produtos.filter((p) => normalize(p.nome)?.includes(q));
        }
        if (filterGrupoId) {
            return sortAvailableFirst(produtos.filter((p) => p.grupo_id === filterGrupoId));
        }
        return null; // null = show grouped home view
    }, [debouncedSearch, filterGrupoId, produtos]);

    // IntersectionObserver: highlight active category while scrolling (home view only)
    useEffect(() => {
        if (!isHomeView || groups.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setScrollGrupoId(Number(entry.target.dataset.grupoId));
                    }
                });
            },
            { rootMargin: '-180px 0px -55% 0px', threshold: 0 }
        );

        groups.forEach(({ grupo }) => {
            const el = sectionRefs.current[grupo.id];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [groups, isHomeView]);

    function handleSearchChange(value) {
        setSearchQuery(value);
        if (value) setFilterGrupoId(null);
    }

    function handleCategorySelect(id) {
        setSearchQuery('');
        setFilterGrupoId(id);
        setScrollGrupoId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // The highlighted tab: clicked category takes priority, otherwise scroll position
    const activeGrupoId = filterGrupoId ?? scrollGrupoId;

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
                {/* Search feedback */}
                {isSearching && !loading && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            <strong>{filteredProdutos.length}</strong> resultado{filteredProdutos.length !== 1 ? 's' : ''} para{' '}
                            <strong>"{debouncedSearch}"</strong>
                        </p>
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

                {/* Search or category filter — flat grid */}
                {!loading && filteredProdutos !== null && filteredProdutos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {filteredProdutos.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={setSelectedProduct}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state for search/filter */}
                {!loading && filteredProdutos !== null && filteredProdutos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-6xl mb-4">🔍</span>
                        <p className="text-gray-600 font-semibold text-lg">
                            {isSearching
                                ? `Nenhum produto encontrado para "${debouncedSearch}"`
                                : 'Nenhum produto nesta categoria'}
                        </p>
                        <button
                            onClick={() => handleCategorySelect(null)}
                            className="mt-4 text-amber-600 font-semibold hover:underline text-sm"
                        >
                            Ver todos os produtos
                        </button>
                    </div>
                )}

                {/* Home — products grouped by category */}
                {!loading && isHomeView && maisVendidos.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-lg font-bold text-gray-700 mb-3 border-l-4 border-amber-500 pl-3">
                            ⭐ Mais Vendidos
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {maisVendidos.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={setSelectedProduct}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Home — products grouped by category */}
                {!loading && isHomeView && groups.map(({ grupo, items }) => (
                    <section
                        key={grupo.id}
                        data-grupo-id={grupo.id}
                        ref={(el) => { sectionRefs.current[grupo.id] = el; }}
                        className="mb-10"
                    >
                        <h2 className="text-lg font-bold text-gray-700 mb-3 border-l-4 border-amber-500 pl-3">
                            {grupo.nome}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {items.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={setSelectedProduct}
                                />
                            ))}
                        </div>
                    </section>
                ))}

                {/* Empty state — no products at all */}
                {!loading && isHomeView && groups.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-6xl mb-4">🛒</span>
                        <p className="text-gray-600 font-semibold text-lg">
                            Nenhum produto disponível
                        </p>
                    </div>
                )}
            </main>

            <Footer />

            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {cartOpen && (
                <CartDrawer onClose={() => setCartOpen(false)} />
            )}

            {infoOpen && (
                <InfoModal onClose={() => setInfoOpen(false)} />
            )}
        </div>
    );
}
