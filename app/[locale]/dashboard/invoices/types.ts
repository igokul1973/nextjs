import { ITypedSearchParams } from '@/app/lib/types';
import { TSingleTranslationKey } from '@/locales/types';
import { z } from 'zod';
import { propsSchema } from './constants';

export type TPageProps = z.infer<typeof propsSchema>;

export type TInvoicesDataProps = {
    searchParams: ITypedSearchParams;
    tableName?: TSingleTranslationKey;
};
