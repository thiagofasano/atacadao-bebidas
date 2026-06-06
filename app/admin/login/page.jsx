'use client';

import { useActionState } from 'react';
import { loginAdmin } from '@/lib/adminActions';
import Image from 'next/image';

export default function AdminLoginPage() {
    const [state, formAction, pending] = useActionState(loginAdmin, null);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex flex-col items-center gap-3">
                    <Image
                        src="/logo-pequeno.png"
                        alt="Logo"
                        width={160}
                        height={56}
                        className="h-14 w-auto object-contain"
                        priority
                    />
                    <p className="text-sm text-gray-500 font-medium">Área restrita</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoFocus
                            autoComplete="current-password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Digite a senha de acesso"
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                            {state.error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        {pending ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
