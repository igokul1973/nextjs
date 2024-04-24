import { LocaleEnum } from '@/app/lib/types';
import { createI18nServer } from 'next-international/server';

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer<
    Partial<Record<LocaleEnum, () => Promise<unknown>>>
>({
    [LocaleEnum.en_US]: () => import('./en'),
    [LocaleEnum.sv_SE]: () => import('./sv')
});
