'use client';

export default function StepPagamento({ dados, onChange }) {
    const precisaTroco = dados.troco !== '' && dados.troco !== 'nao';

    return (
        <div className="space-y-3">
            {/* Destaque pagamento na entrega */}
            <div className="flex items-center gap-3 bg-amber-500 rounded-xl px-4 py-3 mb-4">
                <span className="text-xl shrink-0">⚠️</span>
                <p className="text-sm font-bold text-white">
                    O pagamento deve ser realizado na entrega.
                </p>
            </div>

            {[
                { value: 'credito', label: 'Cartão de Crédito', desc: 'Máquina na entrega' },
                { value: 'debito', label: 'Cartão de Débito', desc: 'Máquina na entrega' },
                { value: 'dinheiro', label: 'Dinheiro', desc: 'Informe se precisar de troco' },
                { value: 'pix', label: 'PIX', desc: 'Na entrega' },
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

            {/* Troco — obrigatório marcar uma opção */}
            {dados.tipoPagamento === 'dinheiro' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-xl space-y-2">
                    <p className="text-sm font-bold text-gray-700 mb-2">Precisa de troco?</p>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${dados.troco === 'nao' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                        <input
                            type="radio"
                            name="troco"
                            checked={dados.troco === 'nao'}
                            onChange={() => onChange({ ...dados, troco: 'nao' })}
                            className="accent-amber-500"
                        />
                        <span className="text-sm font-semibold text-gray-800">Não preciso de troco</span>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${precisaTroco ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                        <input
                            type="radio"
                            name="troco"
                            checked={precisaTroco}
                            onChange={() => onChange({ ...dados, troco: ' ' })}
                            className="accent-amber-500"
                        />
                        <span className="text-sm font-semibold text-gray-800">Preciso de troco</span>
                    </label>

                    {precisaTroco && (
                        <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={dados.troco.trim()}
                                onChange={(e) => onChange({ ...dados, troco: e.target.value || ' ' })}
                                placeholder="0,00"
                                autoFocus
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
