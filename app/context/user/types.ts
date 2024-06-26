import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TEntity, TUser } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IAppState {
    user: TUser;
    account: Omit<TGetUserWithRelationsPayload['account'], 'settings'>;
    profile: NonNullable<TGetUserWithRelationsPayload['profile']>;
    settings: NonNullable<TGetUserWithRelationsPayload['account']['settings']>;
    provider: TEntity;
    providerType: EntitiesEnum;
}

export interface IAppStateAction {
    type: 'update' | 'setProfile' | 'setSettings';
    payload: Partial<IAppState>;
}
