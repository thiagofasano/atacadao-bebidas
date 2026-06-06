'use client';

import { useRef, useState, useEffect } from 'react';

export default function CategoryFilter({ grupos, activeId, onSelect }) {
    const scrollRef = useRef(null);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    function checkScroll() {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [grupos]);

    return (
        <div className="bg-white border-b border-gray-100 sticky top-[132px] sm:top-[105px] z-30">
            <div className="max-w-5xl mx-auto px-4 py-4">
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-1"
                    >
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
                        <span className="shrink-0 w-8 sm:hidden" />
                    </div>

                    {/* Fade + seta esquerda */}
                    <div
                        className={`pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent sm:hidden transition-opacity duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Fade + seta direita */}
                    <div
                        className={`sm:hidden absolute right-0 top-0 h-full flex items-center transition-opacity duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="pointer-events-none w-14 h-full bg-gradient-to-l from-white via-white/80 to-transparent" />
                        <div className="pointer-events-none absolute right-1 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-amber-500 animate-bounce-x"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
