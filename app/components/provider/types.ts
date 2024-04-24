import { TEntity } from '@/app/lib/types';
import { EntitiesEnum } from '@prisma/client';

export interface IProps {
    provider: TEntity;
    providerType: EntitiesEnum;
}
