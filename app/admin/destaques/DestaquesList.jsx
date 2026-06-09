'use client';

import { useState, useTransition } from 'react';
import { salvarDestaques } from '@/lib/adminActions';

function normalize(s) {
    return s?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ?? '';
}

export default function DestaquesList({ produtos, destaquesIds }) {
    const [selected, setSelected] = useState(destaquesIds.map(Number));
    const [search, setSearch] = useState('');
    const [isPending, startTransition] = useTransition();
    const [savedOk, setSavedOk] = useState(false);

    const featuredProducts = selected
        .map((id) => produtos.find((p) => Number(p.id) === id))
        .filter(Boolean);

    const q = normalize(search);
    const availableProducts = produtos.filter(
        (p) => !selected.includes(Number(p.id)) && (!q || normalize(p.nome).includes(q))
    );

    function add(id) {
        setSelected((prev) => [...prev, Number(id)]);
        setSavedOk(false);
    }

    function remove(id) {
        setSelected((prev) => prev.filter((x) => x !== Number(id)));
        setSavedOk(false);
    }

    function moveUp(index) {
        if (index === 0) return;
        setSelected((prev) => {
            const arr = [...prev];
            [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
            return arr;
        });
        setSavedOk(false);
    }

    function moveDown(index) {
        setSelected((prev) => {
            if (index === prev.length - 1) return prev;
            const arr = [...prev];
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            return arr;
        });
        setSavedOk(false);
    }

    function save() {
        startTransition(async () => {
            await salvarDestaques(selected);
            setSavedOk(true);
        });
    }

    return (
        <div className="space-y-6">
            {/* Featured list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-800">
                        ⭐ Produtos em Destaque
                        <span className="ml-2 text-xs font-normal text-gray-400">
                            ({selected.length} selecionado{selected.length !== 1 ? 's' : ''})
                        </span>
                    </h2>
                    <button
                        onClick={save}
                        disabled={isPending}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>

                {savedOk && (
                    <div className="mb-3 text-sm text-green-600 font-semibold bg-green-50 rounded-xl px-4 py-2">
                        ✓ Destaques salvos com sucesso!
                    </div>
                )}

                {featuredProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">
                        Nenhum produto em destaque. Adicione produtos abaixo.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {featuredProducts.map((p, i) => (
                            <li
                                key={p.id}
                                className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3"
                            >
                                <span className="text-xs font-bold text-amber-500 w-5 text-center shrink-0">
                                    {i + 1}
                                </span>
                                <span className="flex-1 text-sm font-semibold text-gray-800 truncate">
                                    {p.nome}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => moveUp(i)}
                                        disabled={i === 0}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-20 p-1 text-xs leading-none"
                                        title="Mover para cima"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => moveDown(i)}
                                        disabled={i === featuredProducts.length - 1}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-20 p-1 text-xs leading-none"
                                        title="Mover para baixo"
                                    >
                                        ▼
                                    </button>
                                    <button
                                        onClick={() => remove(p.id)}
                                        className="ml-1 text-red-400 hover:text-red-600 font-bold text-base p-1 leading-none"
                                        title="Remover destaque"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* All products */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-base font-bold text-gray-800 mb-3">Todos os Produtos</h2>
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-4 focus:outline-none focus:border-amber-400"
                />
                {availableProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                        {search ? 'Nenhum produto encontrado.' : 'Todos os produtos já estão em destaque.'}
                    </p>
                ) : (
                    <ul className="space-y-1 max-h-[480px] overflow-y-auto">
                        {availableProducts.map((p) => (
                            <li
                                key={p.id}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                <span className="flex-1 text-sm text-gray-700 truncate">{p.nome}</span>
                                <button
                                    onClick={() => add(p.id)}
                                    className="text-xs font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors shrink-0"
                                >
                                    + Destacar
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
