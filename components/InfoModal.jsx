'use client';

import { STORE_INFO } from '@/lib/storeInfo';

export default function InfoModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Panel */}
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-amber-500 rounded-t-2xl sm:rounded-t-2xl px-5 py-4 flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">Informações da Loja</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-amber-100 transition-colors text-2xl leading-none"
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Horários */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-base">
                            <span>🕐</span> Horário de Funcionamento
                        </h3>
                        <ul className="space-y-2">
                            {STORE_INFO.horarios.map((h) => (
                                <li key={h.dias} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{h.dias}</span>
                                    <span className="font-semibold text-gray-800">{h.horario}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Endereço */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-base">
                            <span>📍</span> Endereço
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{STORE_INFO.endereco}</p>
                        <a
                            href={STORE_INFO.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-amber-600 font-semibold hover:underline"
                        >
                            Ver no Google Maps →
                        </a>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Formas de Pagamento */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-base">
                            <span>💳</span> Formas de Pagamento
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {STORE_INFO.formasPagamento.map((fp) => (
                                <span
                                    key={fp}
                                    className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full"
                                >
                                    {fp}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * O pagamento é realizado no ato da entrega.
                        </p>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Regras */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-base">
                            <span>📋</span> Regras e Informações
                        </h3>
                        <ul className="space-y-2">
                            {STORE_INFO.regras.map((regra, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span className={idx === 0 ? 'font-semibold text-amber-700' : ''}>{regra}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Destaque pedido mínimo */}
                        <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 rounded p-3">
                            <p className="text-sm font-bold text-amber-800">
                                🛒 Pedido mínimo: R$ {STORE_INFO.pedidoMinimo.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    </section>

                    {/* Contato */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-base">
                            <span>📞</span> Contato
                        </h3>
                        <div className="flex gap-3">
                            <a
                                href={`tel:${STORE_INFO.telefone.replace(/\D/g, '')}`}
                                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 rounded-lg transition-colors"
                            >
                                📱 {STORE_INFO.telefone}
                            </a>
                            <a
                                href={`https://wa.me/${STORE_INFO.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
