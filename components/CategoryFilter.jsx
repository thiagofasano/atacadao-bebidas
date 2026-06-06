'use client';

export default function CategoryFilter({ grupos, activeId, onSelect }) {
    return (
        <div className="bg-white border-b border-gray-100 sticky top-[132px] sm:top-[105px] z-30">
            <div className="max-w-5xl mx-auto px-4 py-4">
                {/* Wrapper com fade à direita indicando scroll */}
                <div className="relative">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:scrollbar-hide pb-2 pt-1">
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
                        {/* Spacer para o fade não cobrir o último item */}
                        <span className="shrink-0 w-8 sm:hidden" />
                    </div>
                    {/* Fade direita — só mobile */}
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent sm:hidden" />
                </div>
            </div>
        </div>
    );
}
