import { TEntityFormRegister } from '@/app/components/customers/types';
import { TIndividualForm, TIndividualFormControl } from '@/app/components/individuals/form/types';
import {
    TOrganizationForm,
    TOrganizationFormControl
} from '@/app/components/organizations/create-form/types';
import { FieldErrors, UseFieldArrayRemove } from 'react-hook-form';

export enum AttributeTypeEnum {
    text = 'text',
    number = 'number',
    yesOrNo = 'yes/no'
}

export interface IProps<T> {
    index: number;
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
