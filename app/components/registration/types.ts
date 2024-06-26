import { TCountry } from '@/app/lib/types';
import { getUserRegistrationSchema } from './utils';
import { z } from 'zod';

export interface ICountryFormProps {
    countries: TCountry[];
}

export type TUserRegistrationForm = z.infer<ReturnType<typeof getUserRegistrationSchema>>;
