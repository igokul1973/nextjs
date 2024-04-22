import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TCountry } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { organizationUpdateSchema } from './formSchema';

export interface IProps {
    userAccountCountry: TCountry;
    localIdentifierName: TGetLocalIdentifierNamePayload;
    form?: TOrganizationForm;
}

export type TOrganizationForm = z.infer<typeof organizationUpdateSchema>;
export type TOrganizationFormControl = Control<TOrganizationForm> & Control<FieldValues>;
export type TPhone = TOrganizationForm['phones'][number];
export type TEmail = TOrganizationForm['emails'][number];
export type TAttribute = TOrganizationForm['attributes'][number];
