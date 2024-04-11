'use client';

import { Dispatch, FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { IRightDrawerAction, IRightDrawerState } from './types';

const rightDrawerReducer = (
    state: IRightDrawerState,
    action: IRightDrawerAction
): IRightDrawerState => {
    switch (action.type) {
        case 'open':
            return {
                ...state,
                isOpen: true,
                childComponent: action.payload.childComponent,
                title: action.payload.title,
                icon: action.payload.icon
            };
        case 'close':
            return {
                ...state,
                isOpen: false,
                childComponent: action.payload.childComponent,
                title: undefined,
                icon: undefined
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const NavContext = createContext<
    | {
          state: IRightDrawerState;
          dispatch: Dispatch<IRightDrawerAction>;
      }
    | undefined
>(undefined);

const NavProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(rightDrawerReducer, {
        isOpen: false,
        childComponent: null
    });
    const value = { state, dispatch };
    return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export const useNavState = () => {
    const context = useContext(NavContext);
    if (context === undefined) {
        throw new Error('useNavState must be used within a NavProvider');
    }
    return context;
};

export default NavProvider;
