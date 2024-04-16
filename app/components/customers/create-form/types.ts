import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TGetOrganizationTypePayload } from '@/app/lib/data/organization-type/types';
import { TCountry } from '@/app/lib/types';

export interface ICustomerFormProps {
    countries: TCountry[];
    userAccountCountry: TCountry;
    localIdentifierNames: TGetLocalIdentifierNamePayload[];
    organizationTypes: TGetOrganizationTypePayload[];
}
