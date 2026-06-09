'use client';

import { STORE_INFO } from '@/lib/storeInfo';

export default function StepEntrega({ dados, onChange }) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Como você deseja receber seu pedido?</p>
            {[
                { value: 'delivery', label: '🛵 Delivery', desc: 'Entregamos no seu endereço' },
                { value: 'retirada', label: '🏪 Retirada no local', desc: 'Você retira na nossa loja' },
            ].map((opt) => (
                <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${dados.tipoEntrega === opt.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                        }`}
                >
                    <input
                        type="radio"
                        name="entrega"
                        value={opt.value}
                        checked={dados.tipoEntrega === opt.value}
                        onChange={() => onChange({ ...dados, tipoEntrega: opt.value })}
                        className="accent-amber-500"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                </label>
            ))}

            {dados.tipoEntrega === 'delivery' && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">🛵 Taxa de entrega</p>
                    <div className="space-y-1.5 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Até 5 km</span>
                            <span className="font-bold text-gray-900">R$ 5,00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Até 10 km</span>
                            <span className="font-bold text-gray-900">R$ 10,00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Acima de 10 km</span>
                            <span className="font-bold text-gray-900">R$ 30,00</span>
                        </div>
                    </div>
                    <p className="text-xs text-amber-700 pt-1 border-t border-amber-200">
                        ⏱️ Tempo médio de entrega: <span className="font-bold">30 a 60 minutos</span>
                    </p>
                </div>
            )}

            {dados.tipoEntrega === 'retirada' && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">🏪 Endereço da loja</p>
                    <p className="text-sm text-gray-700">{STORE_INFO.endereco}</p>
                    <a
                        href={STORE_INFO.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-semibold text-amber-700 underline"
                    >
                        📍 Ver no mapa
                    </a>
                </div>
            )}
        </div>
    );
}
