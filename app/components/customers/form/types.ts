import { TProviderIndForm } from '@/app/components/individuals/form/types';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { TAppLocalIdentifierName } from '@/app/lib/types';

export interface ICustomerEntityFormDataProps {
    localIdentifierName: TAppLocalIdentifierName;
    isEdit: boolean;
}

export interface ICustomerIndFormDataProps extends ICustomerEntityFormDataProps {
    rawDefaultValues: TProviderIndForm;
}
export interface ICustomerOrgFormDataProps extends ICustomerEntityFormDataProps {
    rawDefaultValues: TProviderOrgForm;
}
