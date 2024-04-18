'use client';

import { createContext, useContext } from 'react';
import { IDataState } from '../data/types';

const DataContext = createContext<IDataState>({} as IDataState);

export const useData = () => {
    return useContext(DataContext);
};

export default DataContext;
