'use client';

import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'atacadao_cart';

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { product, qty, observacao } = action.payload;
            const existing = state.items.find((i) => i.id === product.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === product.id
                            ? { ...i, qty: i.qty + qty, observacao: observacao || i.observacao }
                            : i
                    ),
                };
            }
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        id: product.id,
                        nome: product.nome,
                        preco: parseFloat(product.valor_venda ?? product.preco ?? 0),
                        foto: product.fotos?.[0] ?? product.foto ?? product.imagem ?? null,
                        qty,
                        observacao: observacao ?? '',
                    },
                ],
            };
        }
        case 'UPDATE_QTY': {
            const { id, qty } = action.payload;
            if (qty <= 0) {
                return { ...state, items: state.items.filter((i) => i.id !== id) };
            }
            return {
                ...state,
                items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
            };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
        case 'CLEAR_CART':
            return { items: [] };
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    // Rehydrate from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed?.items?.length) {
                    parsed.items.forEach((item) => {
                        dispatch({
                            type: 'ADD_ITEM',
                            payload: {
                                product: { id: item.id, nome: item.nome, valor_venda: item.preco, foto: item.foto },
                                qty: item.qty,
                                observacao: item.observacao,
                            },
                        });
                    });
                }
            }
        } catch {
            // ignore corrupt storage
        }
    }, []);

    // Persist on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const totalQty = state.items.reduce((acc, i) => acc + i.qty, 0);
    const totalValue = state.items.reduce((acc, i) => acc + i.preco * i.qty, 0);
    const cartMap = useMemo(() => new Map(state.items.map((i) => [i.id, i])), [state.items]);

    return (
        <CartContext.Provider value={{ items: state.items, cartMap, totalQty, totalValue, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
