import '@/app/styles/global.css';
import React from 'react';
import ThemeRegistry from '@/app/components/theme-registry/ThemeRegistry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    console.log(children);
    return (
        <html lang='en'>
            <body>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    );
}
