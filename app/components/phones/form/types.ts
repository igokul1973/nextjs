import { TEntityFormRegister } from '@/app/components/customers/types';
import { TIndividualFormControl, TProviderIndForm } from '@/app/components/individuals/form/types';
import {
    TOrganizationFormControl,
    TProviderOrgForm
} from '@/app/components/organizations/form/types';
import { FieldErrors, UseFieldArrayRemove } from 'react-hook-form';

export interface IProps<T> {
    index: number;
    count: number;
    types: string[];
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
    remove: UseFieldArrayRemove;
}
