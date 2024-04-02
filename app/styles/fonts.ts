import { Lusitana, Roboto } from 'next/font/google';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: ['400', '700']
});

export const roboto = Roboto({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    display: 'swap'
});
