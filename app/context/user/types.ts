import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TEntity, TUser } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IUserState {
    user: TUser;
    account: Omit<TGetUserWithRelationsPayload['account'], 'settings'>;
    profile?: TGetUserWithRelationsPayload['profile'] | null;
    settings?: TGetUserWithRelationsPayload['account']['settings'] | null;
    provider?: TEntity | null;
    providerType?: EntitiesEnum;
}

export interface IUserAction {
    type: 'update' | 'setProfile' | 'setSettings';
    payload: Partial<IUserState>;
}
