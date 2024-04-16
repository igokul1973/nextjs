import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import formSchema from './formSchema';

export type TOrganizationForm = z.infer<typeof formSchema>;
export type TOrganizationFormControl = Control<TOrganizationForm> & Control<FieldValues>;
export type TPhone = z.infer<typeof formSchema>['phones'][number];
export type TEmail = z.infer<typeof formSchema>['emails'][number];
export type TAttribute = z.infer<typeof formSchema>['attributes'][number];
