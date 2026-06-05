'use server';

const BASE = 'https://api.gestaoclick.com/api';

function headers() {
    return {
        'access-token': process.env.GESTAOCLICK_ACCESS_TOKEN ?? '',
        'secret-access-token': process.env.GESTAOCLICK_SECRET_ACCESS_TOKEN ?? '',
        'Content-Type': 'application/json',
    };
}

export async function fetchGrupos() {
    try {
        const res = await fetch(`${BASE}/grupos_produtos`, {
            headers: headers(),
            next: { revalidate: 300 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : data?.data ?? [];
    } catch {
        return [];
    }
}

export async function fetchProdutos({ nome, grupo_id, pagina } = {}) {
    try {
        const params = new URLSearchParams();
        if (nome) params.set('nome', nome);
        if (grupo_id) params.set('grupo_id', grupo_id);
        if (pagina) params.set('pagina', pagina);
        params.set('ativo', '1');
        params.set('limite', '50');

        const res = await fetch(`${BASE}/produtos?${params.toString()}`, {
            headers: headers(),
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        return list.filter((p) => p.grupo_id);
    } catch {
        return [];
    }
}
