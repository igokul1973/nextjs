import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TCountry } from '@/app/lib/types';

export interface ICustomerFormProps {
    userAccountCountry: TCountry;
    localIdentifierNames: TGetLocalIdentifierNamePayload[];
}
