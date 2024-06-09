import InvoiceView from '@/app/components/invoice-view/InvoiceView';
import Warning from '@/app/components/warning/Warning';
import { getInvoiceById } from '@/app/lib/data/invoice';
import {
    capitalize,
    formatCurrencyAsCents,
    formatNumeroSign,
    getInvoiceItemSubtotalAfterTax,
    getInvoiceTotal,
    getInvoiceTotalTaxAndDiscount,
    getUser
} from '@/app/lib/utils';
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

    const numberSymbol = formatNumeroSign(locale);

    const invoiceTotal = getInvoiceTotal(invoice.invoiceItems);
    const { taxTotal, discountTotal } = getInvoiceTotalTaxAndDiscount(invoice.invoiceItems);
    const invoiceSubtotal = invoiceTotal - taxTotal + discountTotal;

    try {
        const d = {
            // logo: invoice.providerLogo,
            // logo: 'logo',
            providerName: invoice.providerName,
            invoiceTitle: `${t('invoice').toUpperCase()} ${numberSymbol}`,
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
                headerRow: [
                    '#',
                    'Name',
                    'Price',
                    'Discount',
                    'Quantity',
                    'Units',
                    'Tax',
                    'Item total'
                ],
                dataRows: invoice.invoiceItems.map((ii, i) => {
                    const itemSubtotal = getInvoiceItemSubtotalAfterTax({
                        price: ii.price,
                        discountPercent: ii.discount,
                        taxPercent: ii.salesTax,
                        quantity: ii.quantity
                    });
                    return [
                        i.toString(),
                        ii.name,
                        formatCurrencyAsCents(ii.price, locale),
                        ii.discount.toString(),
                        ii.quantity.toString(),
                        ii.measurementUnit.abbreviation,
                        `${ii.salesTax}%`,
                        formatCurrencyAsCents(itemSubtotal, locale)
                    ];
                }),
                totalRows: [
                    [
                        'Subtotal (before tax and discount)',
                        formatCurrencyAsCents(invoiceSubtotal, locale)
                    ],
                    ['Tax', formatCurrencyAsCents(taxTotal, locale)],
                    ['Discount', formatCurrencyAsCents(discountTotal, locale)],
                    [
                        { text: 'Total', bold: true },
                        { text: formatCurrencyAsCents(invoiceTotal, locale), bold: true }
                    ]
                ]
            },
            invoiceNumber: invoice.number,
            customerCodeTitle: `${capitalize(t('customer'))} ${numberSymbol}`,
            customerCode: invoice.customerCode,
            invoiceDateTitle: capitalize(t('date')),
            invoiceDate: invoice.date,
            customerReferenceTitle: capitalize(t('your reference')) + ':',
            customerReference: invoice.customerRef,
            providerReferenceTitle: capitalize(t('our reference')) + ':',
            providerReference: invoice.providerRef,
            customerLocalIdentifierTitle: `${capitalize(t('your'))} ${invoice.customerLocalIdentifierNameAbbrev}:`,
            customerLocalIdentifierValue: invoice.customerLocalIdentifierValue,
            providerLocalIdentifierTitle: `${capitalize(t('our'))} ${invoice.providerLocalIdentifierNameAbbrev}:`,
            providerLocalIdentifierValue: invoice.providerLocalIdentifierValue,
            paymentTermsTitle: capitalize(t('payment terms')) + ':',
            termsTitle: capitalize(t('terms')),
            terms: invoice.terms,
            paymentTerms: invoice.paymentTerms,
            payByTitle: capitalize(t('pay by date')) + ':',
            payBy: invoice.payBy,
            deliveryTermsTitle: capitalize(t('delivery terms')),
            deliveryTerms: invoice.terms,
            additionalInfo: invoice.additionalInformation,
            providerPhones: `${capitalize(t('for billing inquiries'))}:
                ${invoice.providerPhone}
                ${invoice.providerEmail}
                `,
            bankingInfo: `${capitalize(t('payment information'))}:
                ${invoice.paymentInfo}
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
