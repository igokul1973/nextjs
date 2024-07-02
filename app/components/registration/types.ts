import { TCountry } from '@/app/lib/types';
import { z } from 'zod';
import { getUserRegistrationSchema } from './utils';

export interface ICountryFormProps {
    countries: TCountry[];
}

export type TUserRegistrationForm = z.infer<ReturnType<typeof getUserRegistrationSchema>>;
