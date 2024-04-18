import { TGetCountryPayload } from '@/app/lib/data/country/types';
import { TGetOrganizationTypePayload } from '@/app/lib/data/organization-type/types';
import { Options } from '@emotion/cache';
import { ReactNode } from 'react';

export interface IProps {
    options?: Partial<Options> & { enableCssLayer?: boolean };
    children: ReactNode;
    countries: TGetCountryPayload[];
    organizationTypes: TGetOrganizationTypePayload[];
}
