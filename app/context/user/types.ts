import { getCountries } from '@/app/lib/data/country';
import { TGetOrganizationTypePayload } from '@/app/lib/data/organization-type/types';
import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TEntity } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IAppState {
    user: TGetUserWithRelationsPayload;
    account: Omit<TGetUserWithRelationsPayload['account'], 'settings'>;
    profile: NonNullable<TGetUserWithRelationsPayload['profile']>;
    settings: NonNullable<TGetUserWithRelationsPayload['account']['settings']>;
    provider: TEntity;
    providerType: EntitiesEnum;
}

export interface IDictionary {
    countries: Awaited<ReturnType<typeof getCountries>>;
    organizationTypes: TGetOrganizationTypePayload[];
}

export interface IAppStateAction {
    type: 'update' | 'setProfile' | 'setSettings';
    payload: Partial<IAppState>;
}
