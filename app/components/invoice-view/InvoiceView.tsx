'use client';

import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import CustomerTable from './CustomerTable';
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

const InvoiceView: FC<IProps> = ({ invoice, locale }) => {
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
                    <CustomerTable customer={customer} />
                    {/* <Debug debugObject={invoice.customer} /> */}
                </StyledCustomerInfo>
            </Box>
            <StyledInvoiceItems component='section' className='invoice-items'>
                <InvoiceItemsTable invoiceItems={invoiceItems} tax={invoice.tax} locale={locale} />
            </StyledInvoiceItems>
            {invoice.additionalInformation && (
                <StyledAdditionalInfo component='section' className='invoice-additional-info'>
                    {capitalize(t('additional information'))}:
                    <Box>{invoice.additionalInformation}</Box>
                </StyledAdditionalInfo>
            )}
            <StyledFooter component='section' className='provider-info'>
                <Box>
                    <Box>{capitalize(t('provider address'))}:</Box>
                    <Box>
                        <Box>{invoice.providerName}</Box>
                        <Box>{invoice.providerAddressLine1}</Box>
                        {invoice.providerAddressLine2 && <Box>{invoice.providerAddressLine2}</Box>}
                        {invoice.providerAddressLine3 && <Box>{invoice.providerAddressLine3}</Box>}
                        <Box>
                            {invoice.providerLocality}{' '}
                            {invoice.providerRegion && `${invoice.providerRegion} `}
                            {invoice.providerPostCode}
                        </Box>
                        <Box>{invoice.providerCountry}</Box>
                    </Box>
                </Box>
                <Box>
                    <Box>{capitalize(t('provider email'))}:</Box>
                    <Box>{invoice.providerEmail}</Box>
                </Box>
                <Box>
                    <Box>{capitalize(t('provider phone'))}:</Box>
                    <Box>{invoice.providerPhone}</Box>
                </Box>
                <Box>
                    <Box>{capitalize(t('Payment info'))}:</Box>
                    <Box>{invoice.paymentInfo}</Box>
                </Box>
            </StyledFooter>
            {/* <Debug debugObject={invoice} /> */}
        </StyledInvoice>
    );
};
export default InvoiceView;
