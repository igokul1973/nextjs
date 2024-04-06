import { ICustomer } from '../../types';

export interface ColumnData {
    dataKey: keyof ICustomer;
    label: string;
    numeric?: boolean;
    width: number;
}
