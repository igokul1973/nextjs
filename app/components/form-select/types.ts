import { Control } from 'react-hook-form';

export interface IProps {
    name: string;
    label: string;
    control: Control;
    defaultValue: string[];
}
