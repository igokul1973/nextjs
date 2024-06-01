import { formatCurrency } from '@/app/lib/utils';
import { TSingleTranslationKey } from '@/locales/types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { IInvoiceItemsTableProps } from './types';
import { getI18n } from '@/locales/server';
import capitalize from '@mui/material/utils/capitalize';
import { StyledTableCell } from './styled';

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

const InvoiceItemsTable: FC<IInvoiceItemsTableProps> = async ({
    tax,
    invoiceItems,
    discount,
    locale
}) => {
    const t = await getI18n();
    const subtotal = invoiceItems.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
    const discountSubtotal = subtotal * (discount / 100);
    const totalAfterDiscount = subtotal - discountSubtotal;
    const taxSubtotal = totalAfterDiscount * (tax / 100);
    const total = totalAfterDiscount + taxSubtotal;
    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label='spanning table'>
                <TableHead>
                    <TableRow>
                        {headerRowCells.map((cell) => (
                            <StyledTableCell key={cell.title} align={cell.alignment}>
                                {capitalize(t(cell.title))}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoiceItems.map((ii) => (
                        <TableRow key={ii.id}>
                            <StyledTableCell>{ii.name}</StyledTableCell>
                            <StyledTableCell align='right'>{ii.quantity}</StyledTableCell>
                            <StyledTableCell align='right'>
                                {formatCurrency(ii.price, locale)}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                                {formatCurrency(ii.price * ii.quantity, locale)}
                            </StyledTableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <StyledTableCell rowSpan={4} sx={{ borderBottom: 'none' }} />
                        <StyledTableCell colSpan={2}>{capitalize(t('subtotal'))}</StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrency(subtotal, locale)}
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('rebate/discount'))}</StyledTableCell>
                        <StyledTableCell align='right'>{`${discount} %`}</StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrency(discountSubtotal, locale)}%
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('tax'))}</StyledTableCell>
                        <StyledTableCell align='right'>{`${tax} %`}</StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrency(taxSubtotal, locale)}
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell colSpan={2}>{capitalize(t('total'))}</StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrency(total, locale)}
                        </StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default InvoiceItemsTable;
