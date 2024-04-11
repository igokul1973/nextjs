import { TMuiIcon } from '@/app/lib/types';
import { TTranslationKeys } from '@/locales/types';
import { FC } from 'react';

export interface IComponent {
    title: TTranslationKeys;
    icon: TMuiIcon;
    component: FC;
}

export type TComponentName = Extract<TTranslationKeys, 'account' | 'profile' | 'settings'>;

export type TComponents = Record<TComponentName, IComponent>;
