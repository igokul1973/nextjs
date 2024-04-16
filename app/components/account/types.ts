import { TGetUserPayload } from '@/app/lib/data/user/types';

export type TProvider = TGetUserPayload['account']['individuals'][number] &
    TGetUserPayload['account']['organizations'][number];
