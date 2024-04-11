import { TGetUserPayload } from '@/app/lib/data/users/types';

export type TProvider = TGetUserPayload['account']['individuals'][0] &
    TGetUserPayload['account']['organizations'][0];
