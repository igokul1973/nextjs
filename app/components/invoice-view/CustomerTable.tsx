import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { ICustomerTableProps } from './types';
import { getI18n } from '@/locales/server';
import { capitalize } from '@/app/lib/utils';
import { StyledTableCell } from './styled';

const CustomerTable: FC<ICustomerTableProps> = async ({ customer }) => {
    const t = await getI18n();
    return (
        <TableContainer>
            <Table size='small' sx={{ minWidth: 400 }} aria-label='spanning table'>
                <TableBody>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer name'))}:</StyledTableCell>
                        <StyledTableCell align='left'>{customer.customerName}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer address'))}:</StyledTableCell>
                        <StyledTableCell align='left'>
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
                        </StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer email'))}:</StyledTableCell>
                        <StyledTableCell align='left'>{customer.customerEmail}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell>{capitalize(t('customer phone'))}:</StyledTableCell>
                        <StyledTableCell align='left'>{customer.customerPhone}</StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default CustomerTable;
