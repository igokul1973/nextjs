import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TAppLocalIdentifierName } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { getCustomerOrgUpdateSchema, getProviderOrgUpdateSchema } from './formSchema';

export interface IProps {
    user: TGetUserWithRelationsPayload;
    providerLocalIdentifierName: TAppLocalIdentifierName;
    isCustomer: boolean;
    onSubmit: (formData: TCustomerOrgFormOutput) => Promise<void>;
}

export type TProviderOrgForm = z.input<ReturnType<typeof getProviderOrgUpdateSchema>>;
export type TCustomerOrgForm = z.input<ReturnType<typeof getCustomerOrgUpdateSchema>>;
export type TProviderOrgFormOutput = z.output<ReturnType<typeof getProviderOrgUpdateSchema>>;
export type TCustomerOrgFormOutput = z.output<ReturnType<typeof getCustomerOrgUpdateSchema>>;
export type TProviderOrgFormOutputWithoutLogo = Omit<TProviderOrgFormOutput, 'logo'>;
export type TCustomerOrgFormOutputWithoutLogo = Omit<TCustomerOrgFormOutput, 'logo'>;
export type TOrganizationFormControl = Control<TCustomerOrgForm> & Control<FieldValues>;
export type TPhone = TProviderOrgFormOutput['phones'][number];
export type TEmail = TProviderOrgFormOutput['emails'][number];
export type TAttribute = TProviderOrgFormOutput['attributes'][number];
