import { z } from 'zod';
import FormSchema from './formSchema';
import { Control, FieldValues } from 'react-hook-form';

export type TForm = z.infer<typeof FormSchema>;
export type TIndividualFormControl = Control<TForm> & Control<FieldValues>;
export type TPhone = z.infer<typeof FormSchema>['phones'][number];
export type TEmail = z.infer<typeof FormSchema>['emails'][number];
