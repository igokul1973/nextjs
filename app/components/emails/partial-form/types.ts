import { TEntityFormRegister } from '@/app/components/customers/types';
import {
    TIndividualForm,
    TIndividualFormControl
} from '@/app/components/individuals/create-form/types';
import {
    TOrganizationForm,
    TOrganizationFormControl
} from '@/app/components/organizations/create-form/types';
import { FieldErrors, UseFieldArrayRemove } from 'react-hook-form';

export interface IProps<T> {
    index: number;
    count: number;
    types: string[];
    register: TEntityFormRegister;
    control: T extends TIndividualForm
        ? TIndividualFormControl
        : T extends TOrganizationForm
          ? TOrganizationFormControl
          : never;
    errors: T extends TIndividualForm
        ? FieldErrors<TIndividualForm>
        : T extends TOrganizationForm
          ? FieldErrors<TOrganizationForm>
          : never;
    remove: UseFieldArrayRemove;
}
