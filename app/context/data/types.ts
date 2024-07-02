import { TGetOrganizationTypePayload } from '@/app/lib/data/organization-type/types';
import { IGeoData, TAppCountries } from '@/app/lib/types';

export interface IDataState {
    countries: TAppCountries;
    organizationTypes: TGetOrganizationTypePayload[];
    geoData: IGeoData | null;
}
