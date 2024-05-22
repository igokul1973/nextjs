import InvoiceView from '@/app/components/invoice-view/InvoiceView';
import Warning from '@/app/components/warning/Warning';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getUser } from '@/app/lib/utils';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const ViewInvoiceData: FC<IProps> = async ({ params: { id, locale } }) => {
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

    return <InvoiceView invoice={invoice} locale={userAccountCountry.locale} />;
};

export default ViewInvoiceData;
