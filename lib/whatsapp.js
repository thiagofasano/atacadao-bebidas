const WHATSAPP_NUMBER = '5521997964776';
const STORE_NAME = 'Atacadão de Bebidas Vila da Penha';

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function buildWhatsAppMessage({ numeroPedido, items, nome, telefone, tipoEntrega, tipoPagamento, troco, cep, bairro, rua, numero, complemento, referencia }) {
    const linhasItens = items
        .map((item) => {
            const subtotal = formatCurrency(item.preco * item.qty);
            const obs = item.observacao ? `\n   Obs: ${item.observacao}` : '';
            return `- ${item.qty}x ${item.nome} - ${subtotal}${obs}`;
        })
        .join('\n');

    const total = formatCurrency(items.reduce((acc, i) => acc + i.preco * i.qty, 0));

    const pagamentoTexto =
        tipoPagamento === 'dinheiro' && troco && troco !== 'nao'
            ? `Dinheiro (troco para ${formatCurrency(parseFloat(troco))})`
            : tipoPagamento === 'dinheiro'
                ? 'Dinheiro (sem troco)'
                : tipoPagamento.charAt(0).toUpperCase() + tipoPagamento.slice(1);

    const entregaTexto = tipoEntrega === 'delivery' ? 'Delivery' : 'Retirada no local';

    const enderecoLinhas = tipoEntrega === 'delivery'
        ? [
            `*Endereco:*`,
            `   ${rua}, ${numero}${complemento ? ` - ${complemento}` : ''}`,
            `   ${bairro} - CEP: ${cep}`,
            ...(referencia ? [`   Ref: ${referencia}`] : []),
        ]
        : [];

    const freteLinhas = tipoEntrega === 'delivery'
        ? [
            ``,
            `*Taxa de entrega:*`,
            `   Até 5 km → R$ 5,00`,
            `   Até 10 km → R$ 10,00`,
            `   Acima de 10 km → R$ 30,00`,
        ]
        : [];

    const msg = [
        `*Pedido #${String(numeroPedido).padStart(4, '0')} - ${STORE_NAME}*`,
        ``,
        `*Itens:*`,
        linhasItens,
        ``,
        `*Total: ${total}*`,
        ``,
        `*Nome:* ${nome}`,
        `*Telefone:* ${telefone}`,
        `*Entrega:* ${entregaTexto}`,
        ...enderecoLinhas,
        `*Pagamento:* ${pagamentoTexto}`,
        ...freteLinhas,
    ].join('\n');

    return msg;
}

export function buildWhatsAppUrl(order) {
    const msg = buildWhatsAppMessage(order);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
