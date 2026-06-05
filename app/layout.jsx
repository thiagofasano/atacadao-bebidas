import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import './globals.css';

export const metadata = {
    title: 'Atacadão de Bebidas Vila da Penha',
    description: 'Delivery de bebidas em Vila da Penha e região',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <CartProvider>
                    <ToastProvider>{children}</ToastProvider>
                </CartProvider>
            </body>
        </html>
    );
}
