import { STORE_INFO } from '@/lib/storeInfo';

export default function Footer() {
    return (
        <footer className="mt-10 bg-gray-900 text-gray-300">
            <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                {/* Endereço */}
                <a
                    href={STORE_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 hover:text-amber-400 transition-colors"
                >
                    <span className="shrink-0">📍</span>
                    <span>{STORE_INFO.endereco}</span>
                </a>

                {/* Telefone / WhatsApp */}
                <a
                    href={`https://wa.me/${STORE_INFO.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                    <span className="shrink-0">📞</span>
                    <span>{STORE_INFO.telefone}</span>
                </a>
            </div>
        </footer>
    );
}
