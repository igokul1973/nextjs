import {
    capitalize,
    formatCurrencyAsCents,
    formatNumeroSign,
    getInvoiceTotal
} from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import CustomerTable from './CustomerTable';
import ImageView from './ImageView';
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

const InvoiceView: FC<IProps> = async ({
    invoice,
    locale,
    isDisplayCustomerLocalIdentifier,
    isDisplayProviderLocalIdentifier
}) => {
    const t = await getI18n();
    const logo = invoice.providerLogo;
    const url = logo?.url;
    const { invoiceItems } = invoice;
    const numberSymbol = formatNumeroSign(locale);

    return (
        <StyledInvoice component={Paper} className='invoice-view'>
            <StyledHeader component='section' className='provider-info'>
                {url && <ImageView url={url} />}
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
                    <CustomerTable invoice={invoice} />
                </StyledCustomerInfo>
            </Box>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ flex: 1, display: 'flex', gap: '4rem' }}>
                    <Box>
                        {invoice.providerRef && (
                            <Typography>{capitalize(t('your reference'))}:</Typography>
                        )}
                        {invoice.customerRef && (
                            <Typography>{capitalize(t('our reference'))}:</Typography>
                        )}
                        {invoice.customerLocalIdentifierValue &&
                            isDisplayCustomerLocalIdentifier && (
                                <Typography>
                                    {capitalize(t('your'))}{' '}
                                    {invoice.customerLocalIdentifierNameAbbrev}:
                                </Typography>
                            )}
                        {invoice.providerLocalIdentifierValue &&
                            isDisplayProviderLocalIdentifier && (
                                <Typography>
                                    {capitalize(t('our'))}{' '}
                                    {invoice.providerLocalIdentifierNameAbbrev}:
                                </Typography>
                            )}
                    </Box>
                    <Box>
                        {invoice.customerRef && <Typography>{invoice.customerRef}</Typography>}
                        {invoice.providerRef && <Typography>{invoice.providerRef}</Typography>}
                        {invoice.customerLocalIdentifierValue &&
                            isDisplayCustomerLocalIdentifier && (
                                <Typography>{invoice.customerLocalIdentifierValue}</Typography>
                            )}
                        {invoice.providerLocalIdentifierValue &&
                            isDisplayProviderLocalIdentifier && (
                                <Typography>{invoice.providerLocalIdentifierValue}</Typography>
                            )}
                    </Box>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', gap: '4rem' }}>
                    <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>
                            {capitalize(t('payment amount'))}:
                        </Typography>
                        <Typography>{capitalize(t('pay by date'))}:</Typography>
                        {invoice.paymentTerms && (
                            <Typography>{capitalize(t('payment terms'))}:</Typography>
                        )}
                        {invoice.deliveryTerms && (
                            <Typography>{capitalize(t('delivery terms'))}:</Typography>
                        )}
                    </Box>
                    <Box>
                        <Typography>
                            {formatCurrencyAsCents(getInvoiceTotal(invoice.invoiceItems), locale)}:
                        </Typography>
                        <Typography>{invoice.payBy}:</Typography>
                        {invoice.paymentTerms && <Typography>{invoice.paymentTerms}</Typography>}
                        {invoice.deliveryTerms && <Typography>{invoice.deliveryTerms}</Typography>}
                    </Box>
                </Box>
            </Box>
            <StyledInvoiceItems component='section' className='invoice-items'>
                <InvoiceItemsTable invoiceItems={invoiceItems} locale={locale} />
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
