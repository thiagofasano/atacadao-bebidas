'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatCurrency, buildWhatsAppUrl } from '@/lib/whatsapp';
import StepDados from '@/components/steps/StepDados';
import StepEntrega from '@/components/steps/StepEntrega';
import StepPagamento from '@/components/steps/StepPagamento';

const STEPS = [
    { id: 1, label: 'Dados', icon: '👤' },
    { id: 2, label: 'Entrega', icon: '📦' },
    { id: 3, label: 'Pagamento', icon: '💳' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalValue, dispatch } = useCart();
    const [step, setStep] = useState(1);
    const [orderOpen, setOrderOpen] = useState(false);
    const [dados, setDados] = useState({
        nome: '',
        telefone: '',
        tipoEntrega: 'delivery',
        tipoPagamento: '',
        troco: '',
    });

    function canAdvance() {
        if (step === 1) return dados.nome.trim().length >= 2 && dados.telefone.replace(/\D/g, '').length >= 10;
        if (step === 2) return !!dados.tipoEntrega;
        if (step === 3) return !!dados.tipoPagamento;
        return false;
    }

    function handleConfirm() {
        const url = buildWhatsAppUrl({
            items,
            nome: dados.nome,
            telefone: dados.telefone,
            tipoEntrega: dados.tipoEntrega,
            tipoPagamento: dados.tipoPagamento,
            troco: dados.troco,
        });
        dispatch({ type: 'CLEAR_CART' });
        window.open(url, '_blank');
        router.push('/');
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="text-6xl">🛒</span>
                <p className="text-gray-700 font-bold text-lg">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-500">Adicione produtos antes de finalizar o pedido.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                    Voltar às compras
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-amber-500 shadow-md">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:text-amber-100 transition-colors p-1 -ml-1"
                        aria-label="Voltar"
                    >
                        ← Voltar
                    </button>
                    <h1 className="text-white font-bold text-lg flex-1">Finalizar Pedido</h1>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

                {/* Order summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setOrderOpen(!orderOpen)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-gray-800">🛒 Meu pedido</span>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {items.length} {items.length === 1 ? 'item' : 'itens'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-amber-600 font-extrabold">{formatCurrency(totalValue)}</span>
                            <span className="text-gray-400 text-sm">{orderOpen ? '▲' : '▼'}</span>
                        </div>
                    </button>

                    {orderOpen && (
                        <div className="border-t border-gray-100 px-5 pb-4">
                            <div className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between py-3 gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 leading-snug">{item.nome}</p>
                                            {item.observacao && (
                                                <p className="text-xs text-amber-600 mt-0.5">📝 {item.observacao}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(item.preco)} / un</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs text-gray-500">{item.qty}x</p>
                                            <p className="text-sm font-bold text-gray-800">{formatCurrency(item.preco * item.qty)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Total</span>
                                <span className="text-lg font-extrabold text-gray-900">{formatCurrency(totalValue)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Steps form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Step indicators */}
                    <div className="bg-amber-500 px-5 py-4">
                        <div className="flex items-center gap-2">
                            {STEPS.map((s, idx) => (
                                <div key={s.id} className="flex items-center gap-2 flex-1">
                                    <div className={`flex items-center gap-1.5 shrink-0 ${step >= s.id ? 'text-white' : 'text-amber-300'}`}>
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step > s.id
                                                    ? 'bg-white text-amber-600 border-white'
                                                    : step === s.id
                                                        ? 'bg-amber-600 border-white text-white'
                                                        : 'border-amber-300 text-amber-300'
                                                }`}
                                        >
                                            {step > s.id ? '✓' : s.id}
                                        </div>
                                        <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 rounded ${step > s.id ? 'bg-white' : 'bg-amber-400'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step title */}
                    <div className="px-5 pt-5 pb-2">
                        <h3 className="text-base font-bold text-gray-800">
                            {STEPS[step - 1].icon} {STEPS[step - 1].label}
                        </h3>
                    </div>

                    {/* Step content */}
                    <div className="px-5 pb-5">
                        {step === 1 && <StepDados dados={dados} onChange={setDados} />}
                        {step === 2 && <StepEntrega dados={dados} onChange={setDados} />}
                        {step === 3 && <StepPagamento dados={dados} onChange={setDados} />}
                    </div>

                    {/* Navigation */}
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4 flex gap-3">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-gray-300 font-semibold py-3 rounded-xl transition-colors"
                            >
                                Voltar
                            </button>
                        ) : (
                            <button
                                onClick={() => router.back()}
                                className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-gray-300 font-semibold py-3 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={!canAdvance()}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Próximo
                            </button>
                        ) : (
                            <button
                                onClick={handleConfirm}
                                disabled={!canAdvance()}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                📱 Enviar pelo WhatsApp
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
