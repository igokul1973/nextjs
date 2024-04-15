import { TForm, TIndividualFormControl } from '@/app/components/individuals/create-form/types';
import { FieldErrors, UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';

export enum AttributeTypeEnum {
    text = 'text',
    number = 'number',
    yesOrNo = 'yes/no'
}

export interface IProps {
    index: number;
    errors: FieldErrors<TForm>;
    register: UseFormRegister<TForm>;
    control: TIndividualFormControl;
    remove: UseFieldArrayRemove;
}
