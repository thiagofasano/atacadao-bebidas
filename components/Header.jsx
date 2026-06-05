'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { STORE_INFO } from '@/lib/storeInfo';

export default function Header({ onCartClick, onInfoClick, searchQuery, onSearchChange }) {
    const { totalQty } = useCart();

    return (
        <header className="sticky top-0 z-40 bg-gray-100 shadow-md border-b border-gray-200">
            {/* Main bar — py-6 (dobro do py-3 anterior) */}
            <div className="max-w-5xl mx-auto px-4 py-3 sm:py-6 flex items-center gap-3">
                {/* Logo */}
                <div className="shrink-0">
                    <Image
                        src="/logo-pequeno.png"
                        alt={STORE_INFO.nome}
                        width={160}
                        height={56}
                        className="h-14 w-auto object-contain hidden sm:block"
                        priority
                    />
                    <Image
                        src="/logo-pequeno.png"
                        alt={STORE_INFO.nome}
                        width={56}
                        height={56}
                        className="h-14 w-auto object-contain sm:hidden"
                        priority
                    />
                </div>

                {/* Search bar — hidden on mobile, visible sm+ */}
                <div className="flex-1 relative hidden sm:block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        🔍
                    </span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar produto..."
                        className="w-full pl-9 pr-8 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-400 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Limpar busca"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                    <button
                        onClick={onInfoClick}
                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                        aria-label="Informações da loja"
                    >
                        <span>ℹ️</span>
                        <span className="hidden md:inline">Informações</span>
                    </button>

                    <button
                        onClick={onCartClick}
                        className="relative flex items-center gap-1 bg-white text-amber-600 hover:bg-amber-50 text-sm font-bold px-3 py-2 rounded-full transition-colors shadow"
                        aria-label="Ver carrinho"
                    >
                        <span>🛒</span>
                        {totalQty > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {totalQty > 99 ? '99+' : totalQty}
                            </span>
                        )}
                        <span className="hidden md:inline">Carrinho</span>
                    </button>
                </div>
            </div>

            {/* Search bar — mobile only, second row */}
            <div className="sm:hidden px-4 pt-0 pb-3">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        🔍
                    </span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar produto..."
                        className="w-full pl-9 pr-8 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-400 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Limpar busca"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

