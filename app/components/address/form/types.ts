import { TCountry } from '@/app/lib/types';
import { Control, FieldValues, UseFormRegister } from 'react-hook-form';

export interface IProps {
    register: UseFormRegister<FieldValues>;
    countries: TCountry[];
    userAccountCountry: TCountry;
    control: Control<FieldValues, unknown>;
}
