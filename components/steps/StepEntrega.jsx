'use client';

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
        </div>
    );
}
