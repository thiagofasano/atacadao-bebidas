'use client';

import { memo } from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/whatsapp';

const ProductCard = memo(function ProductCard({ product, onClick }) {
    const { cartMap } = useCart();
    const cartItem = cartMap?.get(product.id);
    const preco = parseFloat(product.valor_venda ?? product.preco ?? 0);
    const indisponivel = product.ativo === '0';

    return (
        <div
            onClick={() => !indisponivel && onClick(product)}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5 hover:shadow-md ${indisponivel ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
        >
            {/* Image */}
            <div className="relative bg-gray-50 aspect-square">
                {product.fotos?.[0] || product.foto || product.imagem ? (
                    <img
                        src={product.fotos?.[0] ?? product.foto ?? product.imagem}
                        alt={product.nome}
                        loading="lazy"
                        className="w-full h-full object-contain p-2"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🍺</div>
                )}

                {/* Cart badge */}
                {cartItem && !indisponivel && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        {cartItem.qty}
                    </span>
                )}

                {/* Unavailable banner */}
                {indisponivel && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs font-semibold text-center py-1">
                        Indisponível
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="text-xs text-gray-800 font-semibold leading-snug line-clamp-2">{product.nome}</p>
                {product.descricao && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{product.descricao}</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-1">
                    <span className="text-amber-600 font-extrabold text-sm">
                        {preco > 0 ? formatCurrency(preco) : '—'}
                    </span>
                    {!indisponivel && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Adicionar
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
