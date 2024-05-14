import { TAccount, TEntity, TProfile, TUser } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IUserState {
    user: TUser;
    account: TAccount;
    profile?: TProfile | null;
    provider?: TEntity | null;
    providerType?: EntitiesEnum;
}

export interface IUserAction {
    type: 'update' | 'setProfile';
    payload: Partial<IUserState>;
}
