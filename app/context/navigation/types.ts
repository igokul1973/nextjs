import { ReactNode } from 'react';

export interface IRightDrawerState {
    isOpen: boolean;
    childComponent: ReactNode | null;
}

export interface IRightDrawerAction {
    type: 'open' | 'close';
    payload: Pick<IRightDrawerState, 'childComponent'>;
}
