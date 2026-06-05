'use client';

export default function StepPagamento({ dados, onChange }) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
                O pagamento é realizado na entrega, ao motoboy.
            </p>
            {[
                { value: 'credito', label: '💳 Cartão de Crédito', desc: 'Máquina na entrega' },
                { value: 'debito', label: '💳 Cartão de Débito', desc: 'Máquina na entrega' },
                { value: 'dinheiro', label: '💵 Dinheiro', desc: 'Informe se precisar de troco' },
                { value: 'pix', label: '⚡ PIX', desc: 'Chave enviada pelo motoboy' },
            ].map((opt) => (
                <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${dados.tipoPagamento === opt.value
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                >
                    <input
                        type="radio"
                        name="pagamento"
                        value={opt.value}
                        checked={dados.tipoPagamento === opt.value}
                        onChange={() => onChange({ ...dados, tipoPagamento: opt.value, troco: '' })}
                        className="accent-amber-500"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                </label>
            ))}

            {/* Troco field */}
            {dados.tipoPagamento === 'dinheiro' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Troco para quanto?
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={dados.troco}
                            onChange={(e) => onChange({ ...dados, troco: e.target.value })}
                            placeholder="0,00"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Deixe em branco se não precisar de troco.</p>
                </div>
            )}
        </div>
    );
}
