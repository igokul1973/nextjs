import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TEntity, TUser } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IUserState {
    user: TUser;
    account: TGetUserWithRelationsPayload['account'];
    profile?: TGetUserWithRelationsPayload['profile'] | null;
    provider?: TEntity | null;
    providerType?: EntitiesEnum;
}

export interface IUserAction {
    type: 'update' | 'setProfile';
    payload: Partial<IUserState>;
}
