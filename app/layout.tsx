import { roboto } from '@/app/ui/fonts';
import '@/app/ui/global.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body className={`${roboto.className} antialiased`}>{children}</body>
        </html>
    );
}
