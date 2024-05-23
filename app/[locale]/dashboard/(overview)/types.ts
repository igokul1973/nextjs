import { ITypedSearchParams } from '@/app/lib/types';

export interface IProps {
    params: {
        locale: string;
    };
    searchParams: ITypedSearchParams;
}
