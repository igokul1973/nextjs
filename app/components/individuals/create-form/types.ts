import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import formSchema from './formSchema';

export type TIndividualForm = z.infer<typeof formSchema>;
export type TIndividualFormControl = Control<TIndividualForm> & Control<FieldValues>;
export type TPhone = TIndividualForm['phones'][number];
export type TEmail = TIndividualForm['emails'][number];
export type TAttribute = TIndividualForm['attributes'][number];
