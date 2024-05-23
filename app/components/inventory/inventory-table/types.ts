import { ITypedSearchParams, TOrder } from '@/app/lib/types';
import { ChangeEvent, MouseEvent } from 'react';
import { IInventoryTable } from '../types';

export interface IHeadCell {
    id: keyof IInventoryTable;
    label: string;
    isNumeric: boolean;
    align: 'left' | 'right' | 'center';
    disablePadding: boolean;
    disableSorting?: boolean;
}

export interface IEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IInventoryTable) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: TOrder;
    orderBy: string;
    rowCount: number;
}

export interface IEnhancedTableToolbarProps {
    numSelected: number;
}

export interface IProps {
    inventory: IInventoryTable[];
    count: number;
    sanitizedSearchParams: ITypedSearchParams;
}

// For old InventoryTable_old.tsx
export interface ColumnData {
    dataKey: keyof IInventoryTable;
    label: string;
    numeric?: boolean;
    width: number;
}
