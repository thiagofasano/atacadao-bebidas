'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/whatsapp';
import { STORE_INFO } from '@/lib/storeInfo';
import CartItem from './CartItem';

export default function CartDrawer({ onClose }) {
    const router = useRouter();
    const { items, totalValue, dispatch } = useCart();
    const faltam = STORE_INFO.pedidoMinimo - totalValue;
    const atingiuMinimo = totalValue >= STORE_INFO.pedidoMinimo;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Drawer */}
            <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl">
                {/* Header */}
                <div className="bg-amber-500 px-5 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white font-bold text-lg">🛒 Carrinho</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-amber-100 text-2xl leading-none transition-colors"
                        aria-label="Fechar carrinho"
                    >
                        ×
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10">
                            <span className="text-6xl">🛒</span>
                            <p className="text-gray-500 font-semibold">Seu carrinho está vazio</p>
                            <p className="text-sm text-gray-400">Adicione produtos para continuar</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-5 space-y-3 shrink-0">
                        {/* Minimum order progress */}
                        {!atingiuMinimo && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                <p className="text-xs text-amber-700 font-semibold mb-1.5">
                                    Faltam {formatCurrency(faltam)} para o pedido mínimo de {formatCurrency(STORE_INFO.pedidoMinimo)}
                                </p>
                                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (totalValue / STORE_INFO.pedidoMinimo) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-semibold">Total</span>
                            <span className="text-xl font-extrabold text-gray-900">{formatCurrency(totalValue)}</span>
                        </div>

                        {/* Clear cart */}
                        <button
                            onClick={() => dispatch({ type: 'CLEAR_CART' })}
                            className="w-full text-xs text-red-400 hover:text-red-600 transition-colors py-1"
                        >
                            Limpar carrinho
                        </button>

                        {/* Checkout button */}
                        <button
                            onClick={() => { onClose(); router.push('/checkout'); }}
                            disabled={!atingiuMinimo}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base transition-colors shadow"
                        >
                            {atingiuMinimo ? 'Finalizar Pedido' : `Mínimo: ${formatCurrency(STORE_INFO.pedidoMinimo)}`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
