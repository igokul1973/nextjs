import { TMuiIcon } from '@/app/lib/types';
import { TSingleTranslationKey } from '@/locales/types';
import { FC } from 'react';

export interface IComponent {
    title: TSingleTranslationKey;
    component: FC;
    icon?: TMuiIcon;
}

export type TComponentName = 'account' | 'profile' | 'settings' | 'profileForm' | 'providerForm';

export type TComponents = Record<TComponentName, IComponent>;
