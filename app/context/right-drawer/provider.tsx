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
                childComponentName: action.payload.childComponentName,
                data: action.payload.data
            };
        case 'close':
            return {
                ...state,
                isOpen: false,
                childComponentName: action.payload.childComponentName,
                data: undefined
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

const RightDrawerProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(rightDrawerReducer, {
        isOpen: false,
        childComponentName: null
    });
    const value = { state, dispatch };
    return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export const useRightDrawerState = () => {
    const context = useContext(NavContext);
    if (context === undefined) {
        throw new Error('useRightDrawerState must be used within a NavProvider');
    }
    return context;
};

export default RightDrawerProvider;
