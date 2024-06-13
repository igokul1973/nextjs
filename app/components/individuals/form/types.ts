import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { getIndividualUpdateSchema } from './formSchema';

export interface IProps {
    localIdentifierName: TGetLocalIdentifierNamePayload;
    isEdit: boolean;
    isCustomer: boolean;
    onSubmit: (formData: TIndividualFormOutput) => Promise<void>;
}

export type TIndividualForm = z.input<ReturnType<typeof getIndividualUpdateSchema>>;
export type TIndividualFormOutput = z.output<ReturnType<typeof getIndividualUpdateSchema>>;
export type TIndividualFormOutputWithoutLogo = Omit<TIndividualFormOutput, 'logo'>;
export type TIndividualFormControl = Control<TIndividualForm> & Control<FieldValues>;
export type TPhone = TIndividualFormOutput['phones'][number];
export type TEmail = TIndividualFormOutput['emails'][number];
export type TAttribute = TIndividualFormOutput['attributes'][number];
