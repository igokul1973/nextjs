import { ITypedSearchParams } from '@/app/lib/types';
import { z } from 'zod';
import { propsSchema } from './constants';

export type TPageProps = z.infer<typeof propsSchema>;
export type TCustomersDataProps = {
    searchParams: ITypedSearchParams & {
        showOrg: boolean;
        showInd: boolean;
    };
};
