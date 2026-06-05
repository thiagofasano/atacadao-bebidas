'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency, buildWhatsAppUrl } from '@/lib/whatsapp';
import StepDados from './steps/StepDados';
import StepEntrega from './steps/StepEntrega';
import StepPagamento from './steps/StepPagamento';

const STEPS = [
    { id: 1, label: 'Dados', icon: '👤' },
    { id: 2, label: 'Entrega', icon: '📦' },
    { id: 3, label: 'Pagamento', icon: '💳' },
];

export default function CheckoutModal({ onClose }) {
    const { items, totalValue, dispatch } = useCart();
    const [step, setStep] = useState(1);
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
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-amber-500 px-5 py-4 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-white font-bold text-lg">Finalizar Pedido</h2>
                        <button onClick={onClose} className="text-white text-2xl leading-none hover:text-amber-100">×</button>
                    </div>

                    {/* Step indicators */}
                    <div className="flex items-center gap-2">
                        {STEPS.map((s, idx) => (
                            <div key={s.id} className="flex items-center gap-2 flex-1">
                                <div
                                    className={`flex items-center gap-1.5 shrink-0 ${step >= s.id ? 'text-white' : 'text-amber-300'
                                        }`}
                                >
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
                <div className="px-5 pt-5 pb-2 shrink-0">
                    <h3 className="text-base font-bold text-gray-800">
                        {STEPS[step - 1].icon} {STEPS[step - 1].label}
                    </h3>
                </div>

                {/* Step content */}
                <div className="flex-1 overflow-y-auto px-5 pb-5">
                    {step === 1 && <StepDados dados={dados} onChange={setDados} />}
                    {step === 2 && <StepEntrega dados={dados} onChange={setDados} />}
                    {step === 3 && <StepPagamento dados={dados} onChange={setDados} />}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-5 space-y-3 shrink-0">
                    {/* Order summary */}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
                        <span className="font-bold text-gray-900">{formatCurrency(totalValue)}</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-gray-300 font-semibold py-3 rounded-xl transition-colors"
                            >
                                Voltar
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
                                📱 Confirmar via WhatsApp
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
