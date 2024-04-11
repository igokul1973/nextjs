import { EntitiesEnum } from '@prisma/client';
import { TProvider } from '../account/types';

export interface IProps {
    provider: TProvider;
    providerType: EntitiesEnum;
}
