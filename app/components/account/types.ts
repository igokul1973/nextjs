import { TGetUserPayload } from '@/app/lib/data/users/types';

export type TProvider = TGetUserPayload['account']['individuals'][number] &
    TGetUserPayload['account']['organizations'][number];
