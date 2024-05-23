import { ISearchParams, ITypedSearchParams } from '@/app/lib/types';

export interface IProps {
    params: { locale: string };
    searchParams: ISearchParams;
}

export type TInventoryDataProps = {
    searchParams: ITypedSearchParams;
};
