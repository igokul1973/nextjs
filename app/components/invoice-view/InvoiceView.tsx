// import { useLogo } from '@/app/lib/hooks/useLogo';
import { useI18n } from '@/locales/client';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FC, useMemo } from 'react';
import CustomerTable from './CustomerTable';
import InvoiceItemsTable from './InvoiceItemsTable';
import {
    StyledAdditionalInfo,
    StyledCustomerInfo,
    StyledFooter,
    StyledHeader,
    StyledInvoice,
    StyledInvoiceInfo,
    StyledInvoiceItems,
    StyledViewPdfBtn
} from './styled';
import { IProps } from './types';
import { getI18n } from '@/locales/server';
import { capitalize } from '@/app/lib/utils';
import ImageView from './ImageView';

const InvoiceView: FC<IProps> = async ({ invoice, locale }) => {
    const t = await getI18n();
    const l = invoice.providerLogo;
    const b = l && Buffer.from(l.data);
    const { customer, invoiceItems } = invoice;

    return (
        <StyledInvoice component={Paper} className='invoice-view'>
            <StyledViewPdfBtn
                href={`/dashboard/invoices/${invoice.id}/view?number=${invoice.number}&isPdf=true`}
                name='View PDF'
                color='secondary'
            />
            <StyledHeader component='section' className='provider-info'>
                {l && b && <ImageView image={b} name={l.name} type={l.type} />}
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
                <InvoiceItemsTable
                    invoiceItems={invoiceItems}
                    tax={invoice.tax}
                    discount={invoice.discount}
                    locale={locale}
                />
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
                    <Box>{capitalize(t('payment info'))}:</Box>
                    <Box>{invoice.paymentInfo}</Box>
                </Box>
            </StyledFooter>
        </StyledInvoice>
    );
};
export default InvoiceView;
