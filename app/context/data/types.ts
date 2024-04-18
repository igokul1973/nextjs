import { TGetOrganizationTypePayload } from '@/app/lib/data/organization-type/types';
import { TCountry } from '@/app/lib/types';

export interface IDataState {
    countries: TCountry[];
    organizationTypes: TGetOrganizationTypePayload[];
}
