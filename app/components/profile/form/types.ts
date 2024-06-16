import { TProfile } from '@/app/lib/types';
import { z } from 'zod';
import { getProfileUpdateSchema, getProfileUpdateSchemaEmptyAvatar } from './formSchema';

export interface IProps {
    profile?: TProfile;
}

export type TProfileForm = z.input<ReturnType<typeof getProfileUpdateSchema>>;
export type TProfileFormOutput = z.output<ReturnType<typeof getProfileUpdateSchema>>;
export type TProfileFormOutputEmptyAvatar = z.output<
    ReturnType<typeof getProfileUpdateSchemaEmptyAvatar>
>;
