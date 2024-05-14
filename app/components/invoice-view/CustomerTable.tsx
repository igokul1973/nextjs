import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { ICustomerTableProps } from './types';

const TAX_RATE = 0.07;

function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
}

interface Row {
    desc: string;
    qty: number;
    unit: number;
    price: number;
}

const headerRowCells: {
    title: Partial<TSingleTranslationKeys>;
    alignment: TableCellProps['align'];
}[] = [
    {
        title: 'name',
        alignment: 'inherit'
    },
    {
        title: 'quantity',
        alignment: 'right'
    },
    {
        title: 'price',
        alignment: 'right'
    },
    {
        title: 'sum',
        alignment: 'right'
    }
];

const CustomerTable: FC<ICustomerTableProps> = ({ customer }) => {
    const t = useI18n();
    return (
        <TableContainer>
            <Table size='small' sx={{ minWidth: 400 }} aria-label='spanning table'>
                <TableBody>
                    <TableRow>
                        <TableCell isScaledInvoice>{capitalize(t('customer name'))}:</TableCell>
                        <TableCell align='left' isScaledInvoice>
                            {customer.customerName}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell isScaledInvoice>{capitalize(t('customer address'))}:</TableCell>
                        <TableCell align='left' isScaledInvoice>
                            <Box>{customer.customerAddressLine1}</Box>
                            {customer.customerAddressLine2 && (
                                <Box>{customer.customerAddressLine2}</Box>
                            )}
                            {customer.customerAddressLine3 && (
                                <Box>{customer.customerAddressLine3}</Box>
                            )}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '0.5rem'
                                    // justifyContent: 'end'
                                }}
                            >
                                <Box component='span'>{customer.customerLocality}</Box>
                                {customer.customerRegion && (
                                    <Box component='span'>{customer.customerRegion}</Box>
                                )}
                                <Box component='span'>{customer.customerPostCode}</Box>
                            </Box>
                            <Box>{customer.customerCountry}</Box>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell isScaledInvoice>{capitalize(t('customer email'))}:</TableCell>
                        <TableCell align='left' isScaledInvoice>
                            {customer.customerEmail}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell isScaledInvoice>{capitalize(t('customer phone'))}:</TableCell>
                        <TableCell align='left' isScaledInvoice>
                            {customer.customerPhone}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default CustomerTable;
