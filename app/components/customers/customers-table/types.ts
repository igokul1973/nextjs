import { TOrder } from '@/app/lib/types';
import { ChangeEvent, MouseEvent } from 'react';
import { ICustomer } from '../types';

export interface IHeadCell {
    disablePadding: boolean;
    id: keyof ICustomerTable;
    label: string;
    isNumeric: boolean;
    align: 'left' | 'right' | 'center';
}

export interface IEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof ICustomerTable) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: TOrder;
    orderBy: string;
    rowCount: number;
}

export interface IEnhancedTableToolbarProps {
    numSelected: number;
}

export interface ICustomerTable extends ICustomer {
    totalPending: string;
    totalPaid: string;
    totalInvoices: number;
}

export interface IProps {
    customers: ICustomer[];
    count: number;
}

export interface IData {
    name: string;
    phone: number;
    email: number;
}

// For old CustomersTable_old.tsx
export interface ColumnData {
    dataKey: keyof ICustomer;
    label: string;
    numeric?: boolean;
    width: number;
}
