'use client';

import { LocaleEnum } from '@/app/lib/types';
import { createI18nClient } from 'next-international/client';

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } =
    createI18nClient({
        [LocaleEnum.en_US]: () => import('./en'),
        [LocaleEnum.sv_SE]: () => import('./sv')
    });
