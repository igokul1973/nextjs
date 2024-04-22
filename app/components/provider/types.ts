import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TEntities } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IProps {
    provider?: TEntities<
        TGetUserWithRelationsPayload['account']['individuals'][number],
        TGetUserWithRelationsPayload['account']['organizations'][number]
    >;
    providerType: EntitiesEnum;
}
