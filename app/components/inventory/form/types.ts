import { TInventoryType } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { getInventoryUpdateSchema } from './formSchema';

export interface IProps {
    types: Pick<TInventoryType, 'id' | 'type'>[];
    defaultValues: TInventoryForm;
    isEdit: boolean;
}

export type TInventoryForm = z.input<ReturnType<typeof getInventoryUpdateSchema>>;
export type TInventoryFormOutput = z.output<ReturnType<typeof getInventoryUpdateSchema>>;
export type TInventoryFormControl = Control<TInventoryForm> & Control<FieldValues>;
