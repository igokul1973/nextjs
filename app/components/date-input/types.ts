import { Control, FieldValues } from 'react-hook-form';
// import { TForm } from '../individuals/create-form/types';

export interface IProps /* <T extends FieldValues> */ {
    name: string;
    label: string;
    control: Control;
    // control: Control<T, unknown>;
    helperText: string;
}
