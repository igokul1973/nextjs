'use client';

import { Dispatch, FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { IUserAction, IUserState } from './types';

const userStateReducer = (state: IUserState, action: IUserAction): IUserState => {
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
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const UserContext = createContext<
    | {
          state: IUserState;
          dispatch: Dispatch<IUserAction>;
      }
    | undefined
>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: FC<{ userState: IUserState } & PropsWithChildren> = ({
    userState,
    children
}) => {
    const [state, dispatch] = useReducer(userStateReducer, userState);
    const value = { state, dispatch };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
