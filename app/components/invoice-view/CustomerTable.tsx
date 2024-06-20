import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { StyledTableCell } from './styled';
import { ICustomerTableProps } from './types';

const CustomerTable: FC<ICustomerTableProps> = async ({ invoice }) => {
    const t = await getI18n();
    return (
        <TableContainer>
            <Table size='small' sx={{ minWidth: 400 }} aria-label='spanning table'>
                <TableBody>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer name'))}:</StyledTableCell>
                        <StyledTableCell align='left'>{invoice.customerName}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer address'))}:</StyledTableCell>
                        <StyledTableCell align='left'>
                            <Box>{invoice.customerAddressLine1}</Box>
                            {invoice.customerAddressLine2 && (
                                <Box>{invoice.customerAddressLine2}</Box>
                            )}
                            {invoice.customerAddressLine3 && (
                                <Box>{invoice.customerAddressLine3}</Box>
                            )}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '0.5rem'
                                    // justifyContent: 'end'
                                }}
                            >
                                <Box component='span'>{invoice.customerLocality}</Box>
                                {invoice.customerRegion && (
                                    <Box component='span'>{invoice.customerRegion}</Box>
                                )}
                                <Box component='span'>{invoice.customerPostCode}</Box>
                            </Box>
                            <Box>{invoice.customerCountry}</Box>
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer email'))}:</StyledTableCell>
                        <StyledTableCell align='left'>{invoice.customerEmail}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer phone'))}:</StyledTableCell>
                        <StyledTableCell align='left'>{invoice.customerPhone}</StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default CustomerTable;
