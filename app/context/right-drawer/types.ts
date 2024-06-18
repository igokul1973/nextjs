import { TComponentName } from '@/app/components/right-drawer/types';

export interface IRightDrawerState {
    isOpen: boolean;
    childComponentName: TComponentName | null;
    data?: Record<string, unknown>;
}

export interface IRightDrawerAction {
    type: 'open' | 'close';
    payload: Omit<IRightDrawerState, 'isOpen'>;
}
