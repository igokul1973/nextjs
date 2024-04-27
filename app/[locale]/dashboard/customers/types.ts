import { ISearchParams } from '@/app/lib/types';

export interface IProps {
    searchParams: ISearchParams & { showOrg: string; showInd: string };
}
