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
import { IInventory } from '../../types';
import { TableCellStyled } from './styled';
import { ColumnData, IProps } from './types';

const columns: ColumnData[] = [
    {
        width: 120,
        label: 'Name',
        dataKey: 'name',
        numeric: false
    },
    {
        width: 120,
        label: 'Description',
        dataKey: 'description',
        numeric: false
    },
    {
        width: 120,
        label: 'Price',
        dataKey: 'price',
        numeric: false
    }
];

const VirtuosoTableComponents: TableComponents<IInventory> = {
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

function RowContent(_index: number, row: IInventory) {
    return (
        <Fragment>
            {columns.map((column) => (
                <TableCellStyled
                    key={column.dataKey}
                    align={column.numeric || false ? 'right' : 'left'}
                    data-column={column.dataKey}
                >
                    {row[column.dataKey]}
                </TableCellStyled>
            ))}
        </Fragment>
    );
}

export default function InventoryTable({ inventory }: IProps) {
    return (
        <Paper style={{ height: 400, width: '100%' }}>
            <TableVirtuoso
                data={inventory}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={RowContent}
            />
        </Paper>
    );
}
