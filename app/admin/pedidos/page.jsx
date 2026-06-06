import { buscarPedidos, logoutAdmin } from '@/lib/adminActions';
import Image from 'next/image';
import PedidosList from './PedidosList';

export default async function AdminPedidosPage() {
    const pedidos = await buscarPedidos();

    const totalDia = pedidos
        .filter((p) => {
            const d = new Date(p.criado_em);
            const hoje = new Date();
            return (
                d.getDate() === hoje.getDate() &&
                d.getMonth() === hoje.getMonth() &&
                d.getFullYear() === hoje.getFullYear()
            );
        })
        .reduce((acc, p) => acc + Number(p.total), 0);

    const formatCurrency = (v) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gray-100 shadow-md border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo-pequeno.png"
                            alt="Logo"
                            width={160}
                            height={44}
                            className="h-11 w-auto object-contain"
                            priority
                        />
                        <span className="text-sm font-semibold text-gray-600 hidden sm:block">Pedidos</span>
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

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total hoje</p>
                        <p className="text-2xl font-extrabold text-amber-600">{formatCurrency(totalDia)}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Pedidos (últimos 300)</p>
                        <p className="text-2xl font-extrabold text-gray-800">{pedidos.length}</p>
                    </div>
                </div>

                {/* Orders list */}
                <PedidosList pedidos={pedidos} />
            </main>
        </div>
    );
}
