import { TForm, TIndividualFormControl } from '@/app/components/individuals/create-form/types';
import { TCountry } from '@/app/lib/types';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export interface IProps {
    register: UseFormRegister<TForm>;
    countries: TCountry[];
    control: TIndividualFormControl;
    errors: FieldErrors<TForm>;
;
}
