'use client';

export default function StepEndereco({ dados, onChange }) {
    function handleCep(value) {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        onChange({ ...dados, cep: formatted });
    }

    async function buscarCep(cep) {
        const digits = cep.replace(/\D/g, '');
        if (digits.length !== 8) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await res.json();
            if (!data.erro) {
                onChange({
                    ...dados,
                    cep,
                    bairro: data.bairro ?? dados.bairro,
                    rua: data.logradouro ?? dados.rua,
                });
            }
        } catch {
            // silently ignore
        }
    }

    return (
        <div className="space-y-4">
            {/* CEP */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    CEP <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={dados.cep ?? ''}
                    onChange={(e) => handleCep(e.target.value)}
                    onBlur={(e) => buscarCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoComplete="postal-code"
                />
            </div>

            {/* Bairro */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Bairro <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={dados.bairro ?? ''}
                    onChange={(e) => onChange({ ...dados, bairro: e.target.value })}
                    placeholder="Seu bairro"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
            </div>

            {/* Rua */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Rua <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={dados.rua ?? ''}
                    onChange={(e) => onChange({ ...dados, rua: e.target.value })}
                    placeholder="Nome da rua"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoComplete="street-address"
                />
            </div>

            {/* Número */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Número <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={dados.numero ?? ''}
                    onChange={(e) => onChange({ ...dados, numero: e.target.value })}
                    placeholder="Ex: 123"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
            </div>

            {/* Ponto de referência */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ponto de referência
                    <span className="text-xs text-gray-400 font-normal ml-1">(opcional)</span>
                </label>
                <input
                    type="text"
                    value={dados.referencia ?? ''}
                    onChange={(e) => onChange({ ...dados, referencia: e.target.value })}
                    placeholder="Ex: próximo ao mercado X"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
            </div>
        </div>
    );
}
