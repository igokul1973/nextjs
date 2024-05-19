import { ISearchParams } from '@/app/lib/types';

export interface IProps {
    params: {
        locale: string;
    };
    searchParams: ISearchParams & { showOrg: string; showInd: string };
}
