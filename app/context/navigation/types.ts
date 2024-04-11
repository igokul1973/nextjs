import { TMuiIcon } from '@/app/lib/types';
import { FC } from 'react';

export interface IRightDrawerState {
    isOpen: boolean;
    childComponent: FC;
    title?: string;
    icon?: TMuiIcon;
}

export interface IRightDrawerAction {
    type: 'open' | 'close';
    payload: Omit<IRightDrawerState, 'isOpen'>;
}
