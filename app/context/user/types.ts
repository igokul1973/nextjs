import { TGetUserPayload } from '@/app/lib/data/user/types';
import { TAccount, TEntities, TProfile, TUser } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IUserState {
    user: TUser;
    profile: TProfile;
    account: TAccount;
    provider?: TEntities<
        TGetUserPayload['account']['individuals'][number],
        TGetUserPayload['account']['organizations'][number]
    >;
    providerType?: EntitiesEnum;
}
