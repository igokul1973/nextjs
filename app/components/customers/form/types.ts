import { TProviderIndForm } from '@/app/components/individuals/form/types';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TCountry } from '@/app/lib/types';

export interface ICustomerFormProps {
    userAccountCountry: TCountry;
    localIdentifierNames: TGetLocalIdentifierNamePayload[];
}

export interface ICustomerEntityFormDataProps {
    localIdentifierName: TGetLocalIdentifierNamePayload;
    isEdit: boolean;
}

export interface ICustomerIndFormDataProps extends ICustomerEntityFormDataProps {
    rawDefaultValues: TProviderIndForm;
}
export interface ICustomerOrgFormDataProps extends ICustomerEntityFormDataProps {
    rawDefaultValues: TProviderOrgForm;
}
