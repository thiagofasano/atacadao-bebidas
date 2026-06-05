'use client';

export default function StepDados({ dados, onChange }) {
    function formatTelefone(value) {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 11)
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        return value;
    }

    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={dados.nome}
                    onChange={(e) => onChange({ ...dados, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoComplete="name"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Telefone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    value={dados.telefone}
                    onChange={(e) => onChange({ ...dados, telefone: formatTelefone(e.target.value) })}
                    placeholder="(21) 99999-9999"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoComplete="tel"
                />
            </div>
        </div>
    );
}
