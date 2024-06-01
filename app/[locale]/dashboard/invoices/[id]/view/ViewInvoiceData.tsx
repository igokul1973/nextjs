import InvoiceView from '@/app/components/invoice-view/InvoiceView';
import Warning from '@/app/components/warning/Warning';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { formatCurrency, getUser } from '@/app/lib/utils';
import Box from '@mui/material/Box';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';
import { baseUrl } from './constants';
import InvoicePdfView from '@/app/components/pdf/InvoicePdfView';
import { getI18n } from '@/locales/server';

const ViewInvoiceData: FC<IProps> = async ({ params: { id, locale }, searchParams: { isPdf } }) => {
    const t = await getI18n();
    setStaticParamsLocale(locale);

    const { provider, account } = await getUser();
    const userAccountCountry = provider?.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before listing invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const rawInvoice = await getInvoiceById(id, account.id);

    if (!rawInvoice) {
        notFound();
    }

    const invoice = {
        ...rawInvoice,
        date: rawInvoice.date.toLocaleDateString(userAccountCountry.locale),
        payBy: rawInvoice.payBy.toLocaleDateString(userAccountCountry.locale),
        paidOn:
            rawInvoice.paidOn === null
                ? null
                : rawInvoice.paidOn.toLocaleDateString(userAccountCountry.locale)
    };

    const fetchPdfUrl = async (d: Record<string, unknown>): Promise<string> => {
        'use server';
        const r = await fetch(`${baseUrl}/api/create/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pageSettings: {
                    pageMargins: [20, 80, 20, 100]
                },
                data: d
            }),
            cache: 'no-store'
        });

        return (await r.json()).url;
    };

    const subtotal = invoice.invoiceItems.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
    const discountSubtotal = subtotal * (invoice.discount / 100);
    const totalAfterDiscount = subtotal - discountSubtotal;
    const taxSubtotal = totalAfterDiscount * (invoice.tax / 100);
    const total = totalAfterDiscount + taxSubtotal;

    try {
        const d = {
            // logo: invoice.providerLogo,
            logo: 'logo',
            providerName: invoice.providerName,
            invoiceTitle: t('invoice').toUpperCase(),
            customerInfo: `${invoice.customerName}
                ${invoice.customerAddressLine1}${invoice.customerAddressLine2 ? '\n' + invoice.customerAddressLine2 : ''}${invoice.customerAddressLine3 ? '\n' + invoice.customerAddressLine3 : ''}
                ${invoice.customerLocality} ${invoice.customerRegion ? invoice.customerRegion + ' ' : ''}${invoice.customerPostCode}
                ${invoice.customerCountry}
                `,
            providerAddress: `${invoice.providerAddressLine1}${invoice.providerAddressLine2 ? '\n' + invoice.providerAddressLine2 : ''}${invoice.providerAddressLine3 ? '\n' + invoice.providerAddressLine3 : ''}
                ${invoice.providerLocality} ${invoice.providerRegion ? invoice.providerRegion + ' ' : ''}${invoice.providerPostCode}
                ${invoice.providerCountry}
                `,
            invoiceTable: {
                headerRow: ['#', 'Name', 'Quantity', 'Units', 'Price', 'Tax', 'Item total'],
                dataRows: invoice.invoiceItems.map((ii, i) => [
                    i.toString(),
                    ii.name.toString(),
                    ii.quantity.toString(),
                    'enh',
                    formatCurrency(ii.price, locale),
                    `${invoice.tax}%`,
                    formatCurrency(ii.price * ii.quantity, locale)
                ]),
                // [41, 'Item 41', 1, 'pcs', '$100', '0%', '$100']
                totalRows: [
                    ['Subtotal', formatCurrency(subtotal, locale)],
                    ['Delivery', '$0'],
                    ['Tax', formatCurrency(taxSubtotal, locale)],
                    ['Discount', `${invoice.discount}%`],
                    [
                        { text: 'Total', bold: true },
                        { text: formatCurrency(total, locale), bold: true }
                    ]
                ]
            },
            invoiceNumberTitle: 'Invoice #',
            invoiceNumber: invoice.number,
            customerNumberTitle: 'Customer #',
            customerNumber: '323',
            invoiceDateTitle: 'Date',
            invoiceDate: invoice.date,
            yourReferenceTitle: 'Your reference',
            yourReference: 'Vlad Tsehanovsckiy',
            ourReferenceTitle: 'Our reference',
            ourReference: 'Anton Tajiev',
            customerLocalIdentifierTitle: 'Customer EIN or SSN',
            customerLocalIdentifier: '521387-8392',
            providerLocalIdentifierTitle: 'Provider EIN or SSN',
            providerLocalIdentifier: '521387-8392',
            paymentTermsTitle: 'Payment terms',
            paymentTerms: invoice.paymentInfo,
            payByTitle: 'Pay by date',
            payBy: invoice.payBy,
            deliveryTermsTitle: 'Delivery terms',
            deliveryTerms: invoice.terms ?? '',
            additionalInfo: invoice.additionalInformation ?? '',
            providerPhones: `For billing inquiries:
                ${invoice.providerPhone}
                ${invoice.providerEmail}
                `,
            bankingInfo: `Bankgiro:
                839-0938
                Plusgiro:
                502-2834
                `
        };
        const url = isPdf && (await fetchPdfUrl(d));

        return (
            <Box component='article'>
                {url ? (
                    <InvoicePdfView src={url} />
                ) : (
                    <InvoiceView invoice={invoice} locale={userAccountCountry.locale} />
                )}
            </Box>
        );
    } catch (error) {
        if (error instanceof Error) {
            return <Warning>{error.message}</Warning>;
        }
    }
};

export default ViewInvoiceData;
