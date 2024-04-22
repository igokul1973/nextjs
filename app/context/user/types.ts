import {
    TAccount,
    TIndividualWithRelations,
    TOrganizationWithRelations,
    TProfile,
    TUser
} from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IUserState {
    user: TUser;
    profile?: TProfile | null;
    account: TAccount;
    provider?: TIndividualWithRelations | TOrganizationWithRelations;
    providerType?: EntitiesEnum;
}
