export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    if (searchParams.get('nome')) params.set('nome', searchParams.get('nome'));
    if (searchParams.get('grupo_id')) params.set('grupo_id', searchParams.get('grupo_id'));
    if (searchParams.get('pagina')) params.set('pagina', searchParams.get('pagina'));
    params.set('ativo', '1');
    params.set('limite', searchParams.get('limite') ?? '50');

    const url = `https://api.gestaoclick.com/api/produtos?${params.toString()}`;

    try {
        const res = await fetch(url, {
            headers: {
                'access-token': process.env.GESTAOCLICK_ACCESS_TOKEN ?? '',
                'secret-access-token': process.env.GESTAOCLICK_SECRET_ACCESS_TOKEN ?? '',
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return Response.json({ error: 'Erro ao buscar produtos', status: res.status }, { status: res.status });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (err) {
        return Response.json({ error: 'Erro interno', message: String(err) }, { status: 500 });
    }
}
