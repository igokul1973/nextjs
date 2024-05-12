'use client';

import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import InvoiceItemsTable from './InvoiceItemsTable';
import {
    StyledAdditionalInfo,
    StyledCustomerInfo,
    StyledFooter,
    StyledHeader,
    StyledInvoice,
    StyledInvoiceInfo,
    StyledInvoiceItems
} from './styled';
import { IProps } from './types';

const InvoiceView: FC<IProps> = ({ invoice }) => {
    const t = useI18n();
    const { customer, invoiceItems } = invoice;
    return (
        <StyledInvoice component={Paper} className='invoice-view'>
            <StyledHeader component='section' className='provider-info'>
                <Box>Avatar</Box>
                <Typography variant='h3'>{invoice.providerName}</Typography>
            </StyledHeader>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <StyledInvoiceInfo component='section' className='invoice-info'>
                    <Typography variant='h2'>
                        {capitalize(t('invoice'))} # {invoice.number}
                    </Typography>
                    <Typography variant='h5'>
                        {capitalize(t('invoice date'))}: {invoice.date}
                    </Typography>
                </StyledInvoiceInfo>
                <StyledCustomerInfo component='section' className='customer-info'>
                    <TableContainer>
                        <Table size='small' sx={{ minWidth: 400 }} aria-label='spanning table'>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{capitalize(t('customer name'))}:</TableCell>
                                    <TableCell align='left'>{customer.customerName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{capitalize(t('customer address'))}:</TableCell>
                                    <TableCell align='left'>
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
                                                <Box component='span'>
                                                    {customer.customerRegion}
                                                </Box>
                                            )}
                                            <Box component='span'>{customer.customerPostCode}</Box>
                                        </Box>
                                        <Box>{customer.customerCountry}</Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{capitalize(t('customer email'))}:</TableCell>
                                    <TableCell align='left'>{customer.customerEmail}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{capitalize(t('customer phone'))}:</TableCell>
                                    <TableCell align='left'>{customer.customerPhone}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <Debug debugObject={invoice.customer} /> */}
                </StyledCustomerInfo>
            </Box>
            <StyledInvoiceItems component='section' className='invoice-items'>
                <InvoiceItemsTable invoiceItems={invoiceItems} />
            </StyledInvoiceItems>
            {invoice.additionalInformation && (
                <StyledAdditionalInfo component='section' className='invoice-additional-info'>
                    {capitalize(t('additional information'))}:
                    <Box>{invoice.additionalInformation}</Box>
                </StyledAdditionalInfo>
            )}
            <StyledFooter component='section' className='provider-info'>
                <Box>{invoice.providerEmail}</Box>
                <Box>{invoice.providerName}</Box>
            </StyledFooter>
            {/* <Debug debugObject={invoice} /> */}
        </StyledInvoice>
    );
};
export default InvoiceView;
