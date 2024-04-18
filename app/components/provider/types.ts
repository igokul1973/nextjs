import { EntitiesEnum } from '@prisma/client';
import { TEntities } from '@/app/lib/types';
import { TGetUserPayload } from '@/app/lib/data/user/types';

export interface IProps {
    provider?: TEntities<
        TGetUserPayload['account']['individuals'][number],
        TGetUserPayload['account']['organizations'][number]
    >;
    providerType: EntitiesEnum;
}
