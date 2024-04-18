import { TEntityFormRegister } from '@/app/components/customers/types';
import {
    TIndividualForm,
    TIndividualFormControl
} from '@/app/components/individuals/create-form/types';
import {
    TOrganizationForm,
    TOrganizationFormControl
} from '@/app/components/organizations/create-form/types';
import { TCountry } from '@/app/lib/types';
import { FieldErrors } from 'react-hook-form';

export interface IProps<T> {
    countries: TCountry[];
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
}
