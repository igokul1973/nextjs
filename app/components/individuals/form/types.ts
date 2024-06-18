import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { getCustomerIndUpdateSchema, getProviderIndUpdateSchema } from './formSchema';

export interface IProps {
    localIdentifierName: TGetLocalIdentifierNamePayload;
    isEdit: boolean;
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
