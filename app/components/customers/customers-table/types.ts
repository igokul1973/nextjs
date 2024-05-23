import { TCustomersDataProps } from '@/app/[locale]/dashboard/customers/types';
import { TOrder } from '@/app/lib/types';
import { ChangeEvent, MouseEvent } from 'react';
import { ICustomerTable } from '../types';

export interface IHeadCell {
    id: keyof ICustomerTable;
    label: string;
    isNumeric: boolean;
    align: 'left' | 'right' | 'center';
    disablePadding: boolean;
    disableSorting?: boolean;
}

export interface IEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof ICustomerTable) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: TOrder;
    orderBy: string;
    rowCount: number;
}

export interface ISelectedFilters extends Record<string, boolean> {
    organizations: boolean;
    individuals: boolean;
}

export interface IEnhancedTableToolbarProps {
    numSelected: number;
    selectedFilters: ISelectedFilters;
    setSelectedFilters: (filters: ISelectedFilters) => void;
}

export interface IProps extends TCustomersDataProps {
    customers: ICustomerTable[];
    count: number;
}

// For old CustomersTable_old.tsx
export interface ColumnData {
    dataKey: keyof ICustomerTable;
    label: string;
    numeric?: boolean;
    width: number;
}
