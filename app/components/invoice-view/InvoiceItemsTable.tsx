import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { IInvoiceItemsTableProps } from './types';

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

function subtotal(items: readonly Row[]) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const InvoiceItemsTable: FC<IInvoiceItemsTableProps> = ({ invoiceItems }) => {
    const t = useI18n();
    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label='spanning table'>
                <TableHead>
                    <TableRow>
                        <TableCell>{capitalize(t('name'))}</TableCell>
                        <TableCell align='right'>{capitalize(t('quantity'))}</TableCell>
                        <TableCell align='right'>{capitalize(t('price'))}</TableCell>
                        <TableCell align='right'>{capitalize(t('sum'))}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoiceItems.map((ii) => (
                        <TableRow key={ii.id}>
                            <TableCell>{ii.name}</TableCell>
                            <TableCell align='right'>{ii.quantity}</TableCell>
                            <TableCell align='right'>{ii.price}</TableCell>
                            <TableCell align='right'>{ccyFormat(ii.price)}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align='right'>200</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tax</TableCell>
                        <TableCell align='right'>{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                        <TableCell align='right'>200</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align='right'>200</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default InvoiceItemsTable;
