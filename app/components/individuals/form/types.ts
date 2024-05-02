import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TCountry } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { individualUpdateSchema } from './formSchema';

export interface IProps {
    userAccountCountry: TCountry;
    localIdentifierName: TGetLocalIdentifierNamePayload;
    form?: TIndividualForm;
}

export type TIndividualForm = z.input<typeof individualUpdateSchema>;
export type TIndividualFormOutput = z.output<typeof individualUpdateSchema>;
export type TIndividualFormControl = Control<TIndividualForm> & Control<FieldValues>;
export type TPhone = TIndividualFormOutput['phones'][number];
export type TEmail = TIndividualFormOutput['emails'][number];
export type TAttribute = TIndividualFormOutput['attributes'][number];
