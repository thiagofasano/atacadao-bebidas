'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ message, type = 'success' }) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-6 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white animate-fade-in-up
                            ${t.type === 'remove' ? 'bg-red-500' : 'bg-green-500'}`}
                    >
                        <span>{t.type === 'remove' ? '🗑️' : '✅'}</span>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}
