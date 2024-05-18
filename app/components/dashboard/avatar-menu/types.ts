import { TMuiIcon } from '@/app/lib/types';
import { TSingleTranslationKey } from '@/locales/types';
import { FC } from 'react';

export interface IComponent {
    title: TSingleTranslationKey;
    icon: TMuiIcon;
    component: FC;
}

export type TComponentName =
    | 'account'
    | 'profile'
    | 'settings'
    | 'updateProfile'
    | 'updateProvider';

export type TComponents = Record<TComponentName, IComponent>;
