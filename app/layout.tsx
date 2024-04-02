import ThemeRegistry from '@/app/components/theme-registry/ThemeRegistry';
import '@/app/styles/global.scss';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <ThemeRegistry>
                <body>{children}</body>
            </ThemeRegistry>
        </html>
    );
}
