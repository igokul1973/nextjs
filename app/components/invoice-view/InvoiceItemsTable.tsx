import {
    capitalize,
    formatCurrencyAsCents,
    formatDiscount,
    formatTax,
    getInvoiceItemSubtotalAfterTax,
    getInvoiceTotal,
    getInvoiceTotalTaxAndDiscount
} from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { TSingleTranslationKey } from '@/locales/types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { StyledTableCell } from './styled';
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
        title: 'measurement unit',
        alignment: 'right'
    },
    {
        title: 'price',
        alignment: 'right'
    },
    {
        title: 'discount',
        alignment: 'right'
    },
    {
        title: 'sales tax',
        alignment: 'right'
    },
    {
        title: 'sum',
        alignment: 'right'
    }
];

const InvoiceItemsTable: FC<IInvoiceItemsTableProps> = async ({ invoiceItems, locale }) => {
    const t = await getI18n();
    const { discountTotal, taxTotal } = getInvoiceTotalTaxAndDiscount(invoiceItems);
    const total = getInvoiceTotal(invoiceItems);
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
                                {ii.measurementUnit.abbreviation}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                                {formatCurrencyAsCents(ii.price, locale)}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                                {formatDiscount(ii.discount)}%
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                                {formatTax(ii.salesTax)}%
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                                {formatCurrencyAsCents(
                                    getInvoiceItemSubtotalAfterTax({
                                        price: ii.price,
                                        discountPercent: ii.discount,
                                        taxPercent: ii.salesTax,
                                        quantity: ii.quantity
                                    }),
                                    locale
                                )}
                            </StyledTableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <StyledTableCell rowSpan={3} colSpan={5} sx={{ borderBottom: 'none' }} />
                        <StyledTableCell>{capitalize(t('discount total'))}:</StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrencyAsCents(discountTotal, locale)}
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('tax total'))}:</StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrencyAsCents(taxTotal, locale)}
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell sx={{ fontWeight: 'bold' }}>
                            {capitalize(t('total'))}:
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                            {formatCurrencyAsCents(total, locale)}
                        </StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default InvoiceItemsTable;
