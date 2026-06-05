export async function GET() {
    const url = 'https://api.gestaoclick.com/api/grupos_produtos';

    try {
        const res = await fetch(url, {
            headers: {
                'access-token': process.env.GESTAOCLICK_ACCESS_TOKEN ?? '',
                'secret-access-token': process.env.GESTAOCLICK_SECRET_ACCESS_TOKEN ?? '',
                'Content-Type': 'application/json',
            },
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            return Response.json({ error: 'Erro ao buscar grupos', status: res.status }, { status: res.status });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (err) {
        return Response.json({ error: 'Erro interno', message: String(err) }, { status: 500 });
    }
}
