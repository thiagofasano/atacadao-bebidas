'use client';

export default function CategoryFilter({ grupos, activeId, onSelect, disabled }) {
    return (
        <div className={`bg-white border-b border-gray-100 sticky top-[105px] z-30 transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="max-w-5xl mx-auto px-4 py-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pt-1">
                    <button
                        onClick={() => onSelect(null)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeId === null
                            ? 'bg-amber-500 text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Todos
                    </button>
                    {grupos.map((grupo) => (
                        <button
                            key={grupo.id}
                            onClick={() => onSelect(grupo.id)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeId === grupo.id
                                ? 'bg-amber-500 text-white shadow'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {grupo.nome}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
