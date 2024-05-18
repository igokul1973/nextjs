import { formatCurrency } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { capitalize } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { IInvoiceItemsTableProps } from './types';

const headerRowCells: {
    title: Partial<TSingleTranslationKey>;
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

const InvoiceItemsTable: FC<IInvoiceItemsTableProps> = ({ tax, invoiceItems, locale }) => {
    const t = useI18n();
    const subtotal = invoiceItems.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
    const taxSubtotal = subtotal * (tax / 100);
    const total = subtotal + taxSubtotal;
    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label='spanning table'>
                <TableHead>
                    <TableRow>
                        {headerRowCells.map((cell) => (
                            <TableCell isScaledInvoice key={cell.title} align={cell.alignment}>
                                {capitalize(t(cell.title))}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoiceItems.map((ii) => (
                        <TableRow key={ii.id}>
                            <TableCell isScaledInvoice>{ii.name}</TableCell>
                            <TableCell align='right' isScaledInvoice>
                                {ii.quantity}
                            </TableCell>
                            <TableCell align='right' isScaledInvoice>
                                {formatCurrency(ii.price, locale)}
                            </TableCell>
                            <TableCell align='right' isScaledInvoice>
                                {formatCurrency(ii.price * ii.quantity, locale)}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell rowSpan={3} isScaledInvoice />
                        <TableCell colSpan={2} isScaledInvoice>
                            {capitalize(t('subtotal'))}
                        </TableCell>
                        <TableCell align='right' isScaledInvoice>
                            {formatCurrency(subtotal, locale)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell isScaledInvoice>{capitalize(t('tax'))}</TableCell>
                        <TableCell align='right' isScaledInvoice>{`${tax} %`}</TableCell>
                        <TableCell align='right' isScaledInvoice>
                            {formatCurrency(taxSubtotal, locale)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} isScaledInvoice>
                            {capitalize(t('total'))}
                        </TableCell>
                        <TableCell align='right' isScaledInvoice>
                            {formatCurrency(total, locale)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default InvoiceItemsTable;
