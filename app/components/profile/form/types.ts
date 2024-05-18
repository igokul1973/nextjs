import { TProfile } from '@/app/lib/types';
import { z } from 'zod';
import { profileUpdateSchema, profileUpdateSchemaEmptyAvatar } from './formSchema';

export interface IProps {
    profile?: TProfile;
}

export type TProfileForm = z.input<typeof profileUpdateSchema>;
export type TProfileFormOutput = z.output<typeof profileUpdateSchema>;
export type TProfileFormOutputEmptyAvatar = z.output<typeof profileUpdateSchemaEmptyAvatar>;
