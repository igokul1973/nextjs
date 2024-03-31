import { Abhaya_Libre, Inter, Lusitana, Roboto } from 'next/font/google';

export const inter = Inter({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'] });
export const abhayaLibre = Abhaya_Libre({
    subsets: ['latin'],
    weight: ['400', '500', '700', '800']
});
export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: ['400', '700']
});
export const roboto = Roboto({
    subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
    weight: ['300', '400', '500', '700', '900']
});
