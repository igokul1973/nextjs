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
import { IAppState, IAppStateAction, IDictionary } from './types';

const PartialAppStateReducer = (
    state: Partial<IAppState> & IDictionary,
    action: IAppStateAction
): Partial<IAppState> & IDictionary => {
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

const appStateReducer = (
    state: IAppState & IDictionary,
    action: IAppStateAction
): IAppState & IDictionary => {
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
          state: Partial<IAppState> & IDictionary;
          dispatch: Dispatch<IAppStateAction>;
      }
    | undefined
>(undefined);

export const AppContext = createContext<
    | {
          state: IAppState & IDictionary;
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

export const AppProvider: FC<{ appState: IAppState & IDictionary } & PropsWithChildren> = ({
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
export const PartialAppProvider: FC<
    { userState: Partial<IAppState> & IDictionary } & PropsWithChildren
> = ({ userState, children }) => {
    const [state, dispatch] = useReducer(PartialAppStateReducer, userState);
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
    return <PartialAppContext.Provider value={value}>{children}</PartialAppContext.Provider>;
};

export default AppProvider;
