'use client';

import { useState } from 'react';

const ENTREGA_LABEL = { delivery: '🛵 Delivery', retirada: '🏪 Retirada' };
const PAGAMENTO_LABEL = { credito: 'Crédito', debito: 'Débito', dinheiro: 'Dinheiro', pix: 'PIX' };

function formatCurrency(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function formatDate(iso) {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function PedidosList({ pedidos }) {
    const [open, setOpen] = useState(null);

    if (!pedidos.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-6xl mb-4">📋</span>
                <p className="text-gray-500 font-semibold">Nenhum pedido ainda.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {pedidos.map((p) => {
                const isOpen = open === p.id;
                const itens = Array.isArray(p.itens) ? p.itens : JSON.parse(p.itens ?? '[]');
                const trocoTexto =
                    p.tipoPagamento === 'dinheiro' || p.tipo_pagamento === 'dinheiro'
                        ? (() => {
                            const t = p.troco;
                            if (!t || t === 'nao') return 'sem troco';
                            const n = parseFloat(t);
                            return isNaN(n) ? 'sem troco' : `troco p/ ${formatCurrency(n)}`;
                        })()
                        : null;

                const pagLabel = PAGAMENTO_LABEL[p.tipo_pagamento] ?? p.tipo_pagamento;
                const entLabel = ENTREGA_LABEL[p.tipo_entrega] ?? p.tipo_entrega;

                return (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header row */}
                        <button
                            onClick={() => setOpen(isOpen ? null : p.id)}
                            className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                        #{String(p.numero).padStart(4, '0')}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800 truncate">{p.nome}</span>
                                    <span className="text-xs text-gray-400">{p.telefone}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                                    <span>{entLabel}</span>
                                    <span>·</span>
                                    <span>{pagLabel}{trocoTexto ? ` (${trocoTexto})` : ''}</span>
                                    <span>·</span>
                                    <span>{formatDate(p.criado_em)}</span>
                                </div>
                                {p.tipo_entrega === 'delivery' && p.rua && (
                                    <p className="text-xs text-gray-400 truncate">
                                        {p.rua}, {p.numero_end} — {p.bairro}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                                <span className="font-extrabold text-gray-900">{formatCurrency(p.total)}</span>
                                <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                            </div>
                        </button>

                        {/* Expandable items */}
                        {isOpen && (
                            <div className="border-t border-gray-100 px-5 pb-4 pt-3 space-y-2">
                                {itens.map((item, i) => (
                                    <div key={i} className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 font-semibold">{item.nome}</p>
                                            {item.observacao && (
                                                <p className="text-xs text-amber-600 mt-0.5">Obs: {item.observacao}</p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0 text-sm text-gray-600">
                                            <span>{item.qty}x </span>
                                            <span className="font-bold">{formatCurrency(item.preco * item.qty)}</span>
                                        </div>
                                    </div>
                                ))}
                                {p.complemento && <p className="text-xs text-gray-400">Compl: {p.complemento}</p>}
                                {p.referencia && <p className="text-xs text-gray-400">Ref: {p.referencia}</p>}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
