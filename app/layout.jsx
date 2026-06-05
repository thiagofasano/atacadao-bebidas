import { CartProvider } from '@/context/CartContext';
import './globals.css';

export const metadata = {
    title: 'Atacadão de Bebidas Vila da Penha',
    description: 'Delivery de bebidas em Vila da Penha e região',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <CartProvider>{children}</CartProvider>
            </body>
        </html>
    );
}
