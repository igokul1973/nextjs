import { z } from 'zod';
import { TProfile } from '@/app/lib/types';
import { profileUpdateSchema } from './formSchema';

export interface IProps {
    profile?: TProfile;
}

export type TProfileForm = z.input<typeof profileUpdateSchema>;
export type TProfileFormOutput = z.output<typeof profileUpdateSchema>;
