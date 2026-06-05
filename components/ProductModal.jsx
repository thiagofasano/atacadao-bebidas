'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/whatsapp';

export default function ProductModal({ product, onClose }) {
    const { dispatch, items } = useCart();
    const [qty, setQty] = useState(1);
    const [observacao, setObservacao] = useState('');

    const cartItem = items.find((i) => i.id === product.id);
    const preco = parseFloat(product.valor_venda ?? product.preco ?? 0);

    function handleAdd() {
        dispatch({ type: 'ADD_ITEM', payload: { product, qty, observacao } });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Panel */}
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-xl leading-none shadow"
                    aria-label="Fechar"
                >
                    ×
                </button>

                {/* Product image */}
                <div className="relative w-full h-52 sm:h-64 bg-gray-100 shrink-0">
                    {product.fotos?.[0] || product.foto || product.imagem ? (
                        <img
                            src={product.fotos?.[0] ?? product.foto ?? product.imagem}
                            alt={product.nome}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">🍺</div>
                    )}
                    {product.ativo === '0' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">
                                Indisponível
                            </span>
                        </div>
                    )}
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 p-5 space-y-4">
                    {/* Name + price */}
                    <div>
                        <h2 className="text-gray-900 font-bold text-xl leading-snug">{product.nome}</h2>
                        {product.descricao && (
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{product.descricao}</p>
                        )}
                        <p className="text-amber-600 font-extrabold text-2xl mt-2">
                            {preco > 0 ? formatCurrency(preco) : 'Consultar preço'}
                        </p>
                        {cartItem && (
                            <p className="text-xs text-green-600 font-semibold mt-1">
                                ✓ {cartItem.qty} já no carrinho
                            </p>
                        )}
                    </div>

                    {/* Quantity selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantidade</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="w-10 h-10 rounded-full border-2 border-amber-400 text-amber-600 font-bold text-xl flex items-center justify-center hover:bg-amber-50 transition-colors"
                            >
                                −
                            </button>
                            <span className="text-xl font-bold text-gray-800 w-8 text-center">{qty}</span>
                            <button
                                onClick={() => setQty((q) => q + 1)}
                                className="w-10 h-10 rounded-full border-2 border-amber-400 text-amber-600 font-bold text-xl flex items-center justify-center hover:bg-amber-50 transition-colors"
                            >
                                +
                            </button>
                            {preco > 0 && (
                                <span className="ml-2 text-sm text-gray-500">
                                    = <strong className="text-gray-700">{formatCurrency(preco * qty)}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Observations */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Observações <span className="font-normal text-gray-400">(opcional)</span>
                        </label>
                        <textarea
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            placeholder="Ex: sem gelo, embrulhado para presente..."
                            maxLength={200}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">{observacao.length}/200</p>
                    </div>
                </div>

                {/* Add to cart button */}
                <div className="p-4 border-t border-gray-100 shrink-0">
                    <button
                        onClick={handleAdd}
                        disabled={product.ativo === '0' || preco <= 0}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-base transition-colors shadow"
                    >
                        {product.ativo === '0'
                            ? 'Produto Indisponível'
                            : `Adicionar ao Carrinho${preco > 0 ? ` — ${formatCurrency(preco * qty)}` : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
