import { TForm, TIndividualFormControl } from '@/app/components/individuals/create-form/types';
import { FieldErrors, UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';

export interface IProps {
    index: number;
    types: string[];
    errors: FieldErrors<TForm>;
    register: UseFormRegister<TForm>;
    control: TIndividualFormControl;
    remove: UseFieldArrayRemove;
}
