'use client';

import { FC, PropsWithChildren, createContext, useContext } from 'react';
import { IUserState } from './types';
import { useSwitchLocale } from './useSwitchLocale';

export const UserContext = createContext<IUserState>({} as IUserState);

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider: FC<{ userState: IUserState } & PropsWithChildren> = ({
    userState,
    children
}) => {
    return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

export default UserProvider;
