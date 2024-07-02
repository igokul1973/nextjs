import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TAppLocalIdentifierName } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { getCustomerIndUpdateSchema, getProviderIndUpdateSchema } from './formSchema';

export interface IProps {
    user: Omit<TGetUserWithRelationsPayload, 'account' | 'profile'>;
    providerLocalIdentifierName?: TAppLocalIdentifierName;
    isCustomer: boolean;
    onSubmit: (formData: TCustomerIndFormOutput) => Promise<void>;
}

export type TProviderIndForm = z.input<ReturnType<typeof getProviderIndUpdateSchema>>;
export type TCustomerIndForm = z.input<ReturnType<typeof getCustomerIndUpdateSchema>>;
export type TProviderIndFormOutput = z.output<ReturnType<typeof getProviderIndUpdateSchema>>;
export type TCustomerIndFormOutput = z.output<ReturnType<typeof getCustomerIndUpdateSchema>>;
export type TProviderIndFormOutputWithoutLogo = Omit<TProviderIndFormOutput, 'logo'>;
export type TCustomerIndFormOutputWithoutLogo = Omit<TCustomerIndFormOutput, 'logo'>;
export type TIndividualFormControl = Control<TCustomerIndForm> & Control<FieldValues>;
export type TPhone = TProviderIndFormOutput['phones'][number];
export type TEmail = TProviderIndFormOutput['emails'][number];
export type TAttribute = TProviderIndFormOutput['attributes'][number];
