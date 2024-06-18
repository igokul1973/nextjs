import { TEntityFormRegister } from '@/app/components/customers/types';
import { TIndividualFormControl, TProviderIndForm } from '@/app/components/individuals/form/types';
import {
    TOrganizationFormControl,
    TProviderOrgForm
} from '@/app/components/organizations/form/types';
import { TCountry } from '@/app/lib/types';
import { FieldErrors } from 'react-hook-form';

export interface IProps<T> {
    countries: TCountry[];
    register: TEntityFormRegister;
    control: T extends TProviderIndForm
        ? TIndividualFormControl
        : T extends TProviderOrgForm
          ? TOrganizationFormControl
          : never;
    errors: T extends TProviderIndForm
        ? FieldErrors<TProviderIndForm>
        : T extends TProviderOrgForm
          ? FieldErrors<TProviderOrgForm>
          : never;
}
