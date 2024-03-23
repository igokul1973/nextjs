import { Abhaya_Libre, Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'] });
export const abhayaLibre = Abhaya_Libre({
    subsets: ['latin'],
    weight: ['400', '500', '700', '800'],
});
export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: ['400', '700'],
});
