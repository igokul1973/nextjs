import { TGetOrganizationTypePayload } from '@/app/lib/data/organization-type/types';
import { TCountry } from '@/app/lib/types';
import { Options } from '@emotion/cache';
import { ReactNode } from 'react';

export interface IProps {
    options?: Partial<Options> & { enableCssLayer?: boolean };
    children: ReactNode;
    countries: TCountry[];
    organizationTypes: TGetOrganizationTypePayload[];
}
