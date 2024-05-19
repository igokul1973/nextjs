import InvoiceView from '@/app/components/invoice-view/InvoiceView';
import Warning from '@/app/components/warning/Warning';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FC } from 'react';
import { StyledBox } from '../../styled';
import { IProps } from './types';
import { setStaticParamsLocale } from 'next-international/server';

const Page: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);
    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider?.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before listing invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const rawInvoice = await getInvoiceById(id, dbUser.account.id);

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

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>
                {capitalize(t('view invoice'))} # {invoice.number}
            </Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    {capitalize(t('invoices'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('view invoice'))}</Typography>
            </Breadcrumbs>
            <InvoiceView invoice={invoice} locale={userAccountCountry.locale} />
        </StyledBox>
    );
};

export default Page;
