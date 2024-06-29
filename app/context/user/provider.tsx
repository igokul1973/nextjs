'use client';

import {
    Dispatch,
    FC,
    PropsWithChildren,
    createContext,
    useContext,
    useMemo,
    useReducer
} from 'react';
import { IAppState, IAppStateAction } from './types';

const PartialAppStateReducer = (
    state: Partial<IAppState>,
    action: IAppStateAction
): Partial<IAppState> => {
    switch (action.type) {
        case 'update':
            return {
                ...state,
                ...action.payload
            };
        case 'setProfile':
            return {
                ...state,
                profile: action.payload.profile
            };
        case 'setSettings':
            return {
                ...state,
                settings: action.payload.settings
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const appStateReducer = (state: IAppState, action: IAppStateAction): IAppState => {
    switch (action.type) {
        case 'update':
            return {
                ...state,
                ...action.payload
            };
        case 'setProfile':
            return {
                ...state,
                profile: action.payload.profile ?? state.profile
            };
        case 'setSettings':
            return {
                ...state,
                settings: action.payload.settings ?? state.settings
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const PartialAppContext = createContext<
    | {
          state: Partial<IAppState>;
          dispatch: Dispatch<IAppStateAction>;
      }
    | undefined
>(undefined);

export const AppContext = createContext<
    | {
          state: IAppState;
          dispatch: Dispatch<IAppStateAction>;
      }
    | undefined
>(undefined);

export const usePartialApp = () => {
    const context = useContext(PartialAppContext);
    if (context === undefined) {
        throw new Error('usePartialApp must be used within a PartialUserProvider');
    }
    return context;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within a UserProvider');
    }
    return context;
};

export const AppProvider: FC<{ appState: IAppState } & PropsWithChildren> = ({
    appState,
    children
}) => {
    const [state, dispatch] = useReducer(appStateReducer, appState);
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Partial - because it may not have all the fields
 */
export const PartialAppProvider: FC<{ userState: Partial<IAppState> } & PropsWithChildren> = ({
    userState,
    children
}) => {
    const [state, dispatch] = useReducer(PartialAppStateReducer, userState);
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
    return <PartialAppContext.Provider value={value}>{children}</PartialAppContext.Provider>;
};

export default AppProvider;
