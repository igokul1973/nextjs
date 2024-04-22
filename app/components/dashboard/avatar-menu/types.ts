import { TMuiIcon } from '@/app/lib/types';
import { TSingleTranslationKeys } from '@/locales/types';
import { FC } from 'react';

export interface IComponent {
    title: TSingleTranslationKeys;
    icon: TMuiIcon;
    component: FC;
}

export type TComponentName = Extract<TSingleTranslationKeys, 'account' | 'profile' | 'settings'>;

export type TComponents = Record<TComponentName, IComponent>;
