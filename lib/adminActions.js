'use server';

import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';

function makeToken() {
    const secret = process.env.AUTH_SECRET ?? '';
    return createHmac('sha256', secret).update('admin-auth').digest('hex');
}

function safeCompare(a, b) {
    // Hash both to fixed length before comparing
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
}

export async function loginAdmin(prevState, formData) {
    const password = formData.get('password') ?? '';
    const adminPassword = process.env.ADMIN_PASSWORD ?? '';

    if (!adminPassword) {
        return { error: 'ADMIN_PASSWORD não configurada no servidor.' };
    }

    if (!safeCompare(password, adminPassword)) {
        return { error: 'Senha incorreta.' };
    }

    const token = makeToken();
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 horas
    });

    redirect('/admin/pedidos');
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    redirect('/admin/login');
}

export async function buscarPedidos() {
    const sql = getDb();
    const rows = await sql`
        SELECT
            id, numero, nome, telefone,
            tipo_entrega, tipo_pagamento, troco,
            cep, bairro, rua, numero_end, complemento, referencia,
            itens, total::float AS total,
            criado_em
        FROM pedidos
        ORDER BY criado_em DESC
        LIMIT 300
    `;
    return rows;
}
