import { z } from 'zod';
import { profileUpdateSchema } from './formSchema';
import { TProfile } from '@/app/lib/types';

export interface IProps {
    profile?: TProfile;
}

export type TProfileForm = z.input<typeof profileUpdateSchema>;
export type TProfileFormOutput = z.output<typeof profileUpdateSchema>;
