import { TOrder } from '@/app/lib/types';
import { TSingleTranslationKey } from '@/locales/types';
import { ChangeEvent, MouseEvent } from 'react';
import { IInvoiceTable } from '../types';

export interface IHeadCell {
    id: keyof IInvoiceTable;
    label: string;
    isNumeric: boolean;
    align: 'left' | 'right' | 'center';
    disablePadding: boolean;
    disableSorting?: boolean;
}

export interface IEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IInvoiceTable) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: TOrder;
    orderBy: string;
    rowCount: number;
}

export interface IEnhancedTableToolbarProps {
    numSelected: number;
    tableName?: TSingleTranslationKey;
}

export interface IProps {
    invoices: IInvoiceTable[];
    count: number;
    tableName?: TSingleTranslationKey;
}

export interface IData {
    name: string;
    phone: number;
    email: number;
}

// For old InventoryTable_old.tsx
export interface ColumnData {
    dataKey: keyof IInvoiceTable;
    label: string;
    numeric?: boolean;
    width: number;
}
