import { TOrder } from '@/app/lib/types';
import { ChangeEvent, MouseEvent } from 'react';
import { IInventory } from '../types';

export interface IHeadCell {
    disablePadding: boolean;
    id: keyof IInventory;
    label: string;
    isNumeric: boolean;
    align: 'left' | 'right' | 'center';
}

export interface IEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IInventory) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: TOrder;
    orderBy: string;
    rowCount: number;
}

export interface IEnhancedTableToolbarProps {
    numSelected: number;
}

export interface IProps {
    inventory: IInventory[];
    count: number;
}

export interface IData {
    name: string;
    phone: number;
    email: number;
}

// For old InventoryTable_old.tsx
export interface ColumnData {
    dataKey: keyof IInventory;
    label: string;
    numeric?: boolean;
    width: number;
}
