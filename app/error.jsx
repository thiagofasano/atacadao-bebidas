'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="text-6xl">⚠️</span>
            <h2 className="text-xl font-bold text-gray-800">Algo deu errado</h2>
            <p className="text-sm text-gray-500 max-w-sm">{error?.message ?? 'Erro desconhecido'}</p>
            <button
                onClick={reset}
                className="mt-2 bg-amber-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
                Tentar novamente
            </button>
        </div>
    );
}
