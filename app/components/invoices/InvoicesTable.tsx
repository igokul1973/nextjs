'use client';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { Fragment } from 'react';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import { IInvoice } from './TableWrapper';

interface IInvoicesTableProps {
    invoices: IInvoice[];
}

interface ColumnData {
    dataKey: keyof IInvoice;
    label: string;
    numeric?: boolean;
    width: number;
}

const columns: ColumnData[] = [
    {
        width: 60,
        label: 'Number',
        dataKey: 'number',
        numeric: false
    },
    {
        width: 120,
        label: 'Customer Name',
        dataKey: 'customerName',
        numeric: false
    },
    {
        width: 120,
        label: 'Email',
        dataKey: 'customerEmail',
        numeric: false
    },
    {
        width: 80,
        label: 'Status',
        dataKey: 'status',
        numeric: false
    },
    {
        width: 80,
        label: 'Date',
        dataKey: 'date',
        numeric: true
    },
    {
        width: 100,
        label: 'Created By',
        dataKey: 'createdByUserEmail',
        numeric: false
    }
];

const VirtuosoTableComponents: TableComponents<IInvoice> = {
    Scroller: React.forwardRef<HTMLDivElement>(function Scroller(props, ref) {
        return <TableContainer component={Paper} {...props} ref={ref} />;
    }),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>(function TableBodyComponent(props, ref) {
        return <TableBody {...props} ref={ref} />;
    })
};

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant='head'
                    align={column.numeric || false ? 'right' : 'left'}
                    style={{ width: column.width }}
                    sx={{
                        backgroundColor: 'background.paper'
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

function rowContent(_index: number, row: IInvoice) {
    return (
        <Fragment>
            {columns.map((column) => (
                <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
                    {row[column.dataKey]}
                </TableCell>
            ))}
        </Fragment>
    );
}

export default function InvoicesTable({ invoices }: IInvoicesTableProps) {
    return (
        <Paper style={{ height: 400, width: '100%' }}>
            <TableVirtuoso
                data={invoices}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}
