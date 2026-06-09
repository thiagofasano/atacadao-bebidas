'use server';

import { getDb } from '@/lib/db';

const BASE = 'https://api.gestaoclick.com/api';

// Remove dados internos da API (ex.: valor_custo) antes de enviar ao
// navegador. Só sai daqui o que o site realmente exibe/usa.
function sanitizeProduto(p) {
    return {
        id: p.id,
        nome: p.nome,
        descricao: p.descricao ?? '',
        preco: parseFloat(p.valor_venda ?? p.preco ?? 0),
        grupo_id: p.grupo_id,
        ativo: p.ativo,
        movimenta_estoque: p.movimenta_estoque,
        estoque: p.estoque,
        fotos: p.fotos ?? undefined,
        foto: p.foto ?? undefined,
        imagem: p.imagem ?? undefined,
    };
}

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

export async function fetchProdutos({ nome, grupo_id } = {}) {
    try {
        const all = [];
        let pagina = 1;
        const limite = 50;

        while (true) {
            const params = new URLSearchParams();
            if (nome) params.set('nome', nome);
            if (grupo_id) params.set('grupo_id', grupo_id);
            params.set('ativo', '1');
            params.set('limite', String(limite));
            params.set('pagina', String(pagina));

            const res = await fetch(`${BASE}/produtos?${params.toString()}`, {
                headers: headers(),
                next: { revalidate: 60 },
            });
            if (!res.ok) break;
            const data = await res.json();
            const list = Array.isArray(data) ? data : data?.data ?? [];
            const filtered = list.filter((p) => p.grupo_id).map(sanitizeProduto);
            all.push(...filtered);

            if (list.length < limite) break;
            pagina++;
        }

        return all;
    } catch {
        return [];
    }
}

export async function fetchDestaquesIds() {
    try {
        const sql = getDb();
        await sql`
            CREATE TABLE IF NOT EXISTS produtos_destaque (
                produto_id INTEGER NOT NULL,
                ordem      INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (produto_id)
            )
        `;
        const rows = await sql`SELECT produto_id FROM produtos_destaque ORDER BY ordem ASC`;
        return rows.map((r) => Number(r.produto_id));
    } catch {
        return [];
    }
}

export async function salvarPedido({ nome, telefone, tipoEntrega, tipoPagamento, troco, cep, bairro, rua, numero, complemento, referencia, items, total }) {
    const sql = getDb();

    // Garante que a tabela existe
    await sql`
        CREATE TABLE IF NOT EXISTS pedidos (
            id          SERIAL PRIMARY KEY,
            numero      INTEGER UNIQUE,
            nome        TEXT NOT NULL,
            telefone    TEXT NOT NULL,
            tipo_entrega TEXT NOT NULL,
            tipo_pagamento TEXT NOT NULL,
            troco       TEXT,
            cep         TEXT,
            bairro      TEXT,
            rua         TEXT,
            numero_end  TEXT,
            complemento TEXT,
            referencia  TEXT,
            itens       JSONB NOT NULL,
            total       NUMERIC(10,2) NOT NULL,
            criado_em   TIMESTAMPTZ DEFAULT NOW()
        )
    `;

    // Incrementa o contador e salva
    const [{ nextval }] = await sql`SELECT nextval('pedido_numero_seq'::regclass) AS nextval`
        .catch(async () => {
            await sql`CREATE SEQUENCE IF NOT EXISTS pedido_numero_seq START 1`;
            return sql`SELECT nextval('pedido_numero_seq'::regclass) AS nextval`;
        });

    const numeroPedido = Number(nextval);

    await sql`
        INSERT INTO pedidos (numero, nome, telefone, tipo_entrega, tipo_pagamento, troco, cep, bairro, rua, numero_end, complemento, referencia, itens, total)
        VALUES (
            ${numeroPedido}, ${nome}, ${telefone}, ${tipoEntrega}, ${tipoPagamento},
            ${troco || null}, ${cep || null}, ${bairro || null}, ${rua || null},
            ${numero || null}, ${complemento || null}, ${referencia || null},
            ${JSON.stringify(items)}, ${total}
        )
    `;

    return numeroPedido;
}
