import { fetchProdutos, fetchDestaquesIds } from '@/lib/actions';
import { logoutAdmin } from '@/lib/adminActions';
import Image from 'next/image';
import Link from 'next/link';
import DestaquesList from './DestaquesList';

export const metadata = {
    robots: { index: false, follow: false },
    title: 'Admin — Destaques',
};

export default async function AdminDestaquesPage() {
    const [produtos, destaquesIds] = await Promise.all([
        fetchProdutos(),
        fetchDestaquesIds(),
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gray-100 shadow-md border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo-pequeno.png"
                            alt="Logo"
                            width={160}
                            height={44}
                            className="h-11 w-auto object-contain"
                            priority
                        />
                        <nav className="flex items-center gap-3 text-sm font-semibold">
                            <Link
                                href="/admin/pedidos"
                                className="text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Pedidos
                            </Link>
                            <span className="text-gray-300">|</span>
                            <span className="text-amber-600">Destaques</span>
                        </nav>
                    </div>
                    <form action={logoutAdmin}>
                        <button
                            type="submit"
                            className="text-sm text-gray-500 hover:text-red-600 font-semibold transition-colors"
                        >
                            Sair
                        </button>
                    </form>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-6">
                <DestaquesList produtos={produtos} destaquesIds={destaquesIds} />
            </main>
        </div>
    );
}
