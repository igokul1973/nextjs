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
    FlexBox,
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
import { capitalize, formatNumeroSign } from '@/app/lib/utils';
import ImageView from './ImageView';

const InvoiceView: FC<IProps> = async ({ invoice, locale }) => {
    const t = await getI18n();
    const l = invoice.providerLogo;
    const b = l && Buffer.from(l.data);
    const { customer, invoiceItems } = invoice;
    const numberSymbol = formatNumeroSign(locale);

    return (
        <StyledInvoice component={Paper} className='invoice-view'>
            <StyledViewPdfBtn
                href={`/dashboard/invoices/${invoice.id}/view?number=${invoice.number}&isPdf=true`}
                name='View PDF'
                color='secondary'
            />
            <StyledHeader component='section' className='provider-info'>
                {l && b && <ImageView image={b} name={l.name} type={l.type} />}
                <Typography variant='h3'>{invoice.providerName.toUpperCase()}</Typography>
            </StyledHeader>
            <Box sx={{ display: 'flex' }}>
                <StyledInvoiceInfo component='section' className='invoice-info'>
                    <Typography variant='h2'>
                        {t('invoice').toUpperCase()} {numberSymbol} {invoice.number}
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            marginTop: '1rem',
                            display: 'flex',
                            gap: '3rem'
                        }}
                    >
                        <Typography variant='h5'>
                            {capitalize(t('invoice date'))}: {invoice.date}
                        </Typography>
                        {invoice.customerCode && (
                            <Typography variant='h5'>
                                {capitalize(t('customer'))} {numberSymbol}: {invoice.customerCode}
                            </Typography>
                        )}
                    </Box>
                </StyledInvoiceInfo>
                <StyledCustomerInfo component='section' className='customer-info'>
                    <CustomerTable customer={customer} />
                    {/* <Debug debugObject={invoice.customer} /> */}
                </StyledCustomerInfo>
            </Box>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ flex: 1, display: 'flex', gap: '4rem' }}>
                    <Box>
                        {invoice.customerRef && (
                            <Typography>{capitalize(t('our reference'))}:</Typography>
                        )}
                        {invoice.providerRef && (
                            <Typography>{capitalize(t('your reference'))}:</Typography>
                        )}
                        {invoice.customerLocalIdentifierValue && (
                            <Typography>
                                {capitalize(t('your'))} {invoice.customerLocalIdentifierNameAbbrev}:
                            </Typography>
                        )}
                        {invoice.providerLocalIdentifierValue && (
                            <Typography>
                                {capitalize(t('your'))} {invoice.customerLocalIdentifierNameAbbrev}:
                            </Typography>
                        )}
                    </Box>
                    <Box>
                        {invoice.customerRef && <Typography>{invoice.customerRef}</Typography>}
                        {invoice.providerRef && <Typography>{invoice.providerRef}</Typography>}
                        {invoice.customerLocalIdentifierValue && (
                            <Typography>{invoice.customerLocalIdentifierValue}</Typography>
                        )}
                        {invoice.providerLocalIdentifierValue && (
                            <Typography>{invoice.providerLocalIdentifierValue}</Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', gap: '4rem' }}>
                    <Box>
                        <Typography>{capitalize(t('pay by date'))}:</Typography>
                        {invoice.paymentTerms && (
                            <Typography>{capitalize(t('payment terms'))}:</Typography>
                        )}
                        {invoice.deliveryTerms && (
                            <Typography>{capitalize(t('delivery terms'))}:</Typography>
                        )}
                    </Box>
                    <Box>
                        <Typography>{invoice.payBy}:</Typography>
                        {invoice.paymentTerms && <Typography>{invoice.paymentTerms}</Typography>}
                        {invoice.deliveryTerms && <Typography>{invoice.deliveryTerms}</Typography>}
                    </Box>
                </Box>
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
            {invoice.terms && (
                <StyledAdditionalInfo component='section' className='invoice-additional-info'>
                    {capitalize(t('terms'))}:<Box>{invoice.terms}</Box>
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
                    <Box>{capitalize(t('for billing inquiries'))}:</Box>
                    <Box>{invoice.providerPhone}</Box>
                    <Box>{invoice.providerEmail}</Box>
                </Box>
                <Box>
                    <Box>{capitalize(t('payment info'))}:</Box>
                    <Box sx={{ whiteSpace: 'pre-wrap' }}>{invoice.paymentInfo}</Box>
                </Box>
            </StyledFooter>
        </StyledInvoice>
    );
};
export default InvoiceView;
