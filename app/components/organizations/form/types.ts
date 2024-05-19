import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { organizationUpdateSchema } from './formSchema';

export interface IProps {
    localIdentifierName: TGetLocalIdentifierNamePayload;
    isEdit: boolean;
    isCustomer: boolean;
    onSubmit: (formData: TOrganizationFormOutput) => Promise<void>;
}

export type TOrganizationForm = z.input<typeof organizationUpdateSchema>;
export type TOrganizationFormOutput = z.output<typeof organizationUpdateSchema>;
export type TOrganizationFormOutputWithoutLogo = Omit<TOrganizationFormOutput, 'logo'>;
export type TOrganizationFormControl = Control<TOrganizationForm> & Control<FieldValues>;
export type TPhone = TOrganizationFormOutput['phones'][number];
export type TEmail = TOrganizationFormOutput['emails'][number];
export type TAttribute = TOrganizationFormOutput['attributes'][number];
