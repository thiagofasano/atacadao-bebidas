'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/whatsapp';

export default function CartItem({ item }) {
    const { dispatch } = useCart();
    const { showToast } = useToast();

    return (
        <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug">{item.nome}</p>
                {item.observacao && (
                    <p className="text-xs text-amber-600 mt-0.5">📝 {item.observacao}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(item.preco)} / un</p>
            </div>

            {/* Qty controls + subtotal */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty - 1 } })}
                        className="w-7 h-7 rounded-full border border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        −
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-gray-700">{item.qty}</span>
                    <button
                        onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}
                        className="w-7 h-7 rounded-full border border-gray-300 text-gray-500 hover:border-amber-400 hover:text-amber-500 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        +
                    </button>
                </div>
                <span className="text-sm font-bold text-gray-800">{formatCurrency(item.preco * item.qty)}</span>
                <button
                    onClick={() => {
                        dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
                        showToast({ message: `${item.nome} removido`, type: 'remove' });
                    }}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                    Remover
                </button>
            </div>
        </div>
    );
}
