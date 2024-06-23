import { TProfile } from '@/app/lib/types';
import { z } from 'zod';
import {
    getProfileCreateSchema,
    getProfileUpdateSchema,
    getProfileUpdateSchemaEmptyAvatar
} from './formSchema';

export interface IProps {
    profile?: TProfile;
}

export type TProfileCreateForm = z.input<ReturnType<typeof getProfileCreateSchema>>;
export type TProfileCreateFormOutput = z.output<ReturnType<typeof getProfileCreateSchema>>;
export type TProfileUpdateForm = z.input<ReturnType<typeof getProfileUpdateSchema>>;
export type TProfileUpdateFormOutput = z.output<ReturnType<typeof getProfileUpdateSchema>>;
export type TProfileFormOutputEmptyAvatar = z.output<
    ReturnType<typeof getProfileUpdateSchemaEmptyAvatar>
>;
