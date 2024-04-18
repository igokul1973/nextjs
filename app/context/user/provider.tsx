'use client';

import { FC, PropsWithChildren, createContext, useContext } from 'react';
import { IUserState } from './types';

export const UserContext = createContext<IUserState>({} as IUserState);

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider: FC<{ value: IUserState } & PropsWithChildren> = ({
    value,
    children
}) => {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
