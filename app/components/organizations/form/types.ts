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

export type TOrganizationForm = z.input<typeof organizationUpdateSchema>;
export type TOrganizationFormOutput = z.output<typeof organizationUpdateSchema>;
export type TOrganizationFormControl = Control<TOrganizationForm> & Control<FieldValues>;
export type TPhone = TOrganizationFormOutput['phones'][number];
export type TEmail = TOrganizationFormOutput['emails'][number];
export type TAttribute = TOrganizationFormOutput['attributes'][number];
