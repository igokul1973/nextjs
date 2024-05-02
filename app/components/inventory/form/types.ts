import { TInventoryType } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { inventoryUpdateSchema } from './formSchema';

export interface IProps {
    types: Pick<TInventoryType, 'id' | 'type'>[];
    form?: TInventoryForm;
}

export type TInventoryForm = z.input<typeof inventoryUpdateSchema>;
export type TInventoryFormControl = Control<TInventoryForm> & Control<FieldValues>;
