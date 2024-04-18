'use client';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Fragment, forwardRef } from 'react';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import { ICustomer } from '../types';
import { ColumnData } from './types';

const columns: ColumnData[] = [
    {
        width: 120,
        label: 'Customer Name',
        dataKey: 'name',
        numeric: false
    },
    {
        width: 120,
        label: 'Email',
        dataKey: 'email',
        numeric: false
    },
    {
        width: 120,
        label: 'Phone',
        dataKey: 'phone',
        numeric: false
    }
];

const VirtuosoTableComponents: TableComponents<ICustomer> = {
    Scroller: forwardRef<HTMLDivElement>(function Scroller(props, ref) {
        return <TableContainer component={Paper} {...props} ref={ref} />;
    }),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: forwardRef<HTMLTableSectionElement>(function TableBodyComponent(props, ref) {
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

function rowContent(_index: number, row: ICustomer) {
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

export default function CustomersTableOld({ customers }: { customers: ICustomer[] }) {
    return (
        <Paper style={{ height: 400, width: '100%' }}>
            <TableVirtuoso
                data={customers}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}
