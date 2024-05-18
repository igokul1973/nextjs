import DashboardCardWrapper from '@/app/components/dashboard/dashboard-card-wrapper/CardWrapper';
import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/components/skeletons';
import Warning from '@/app/components/warning/Warning';
import {
    getFilteredInvoicesByAccountId,
    getFilteredInvoicesByAccountIdCount
} from '@/app/lib/data/invoice';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, formatCurrency, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import { Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from '../invoices/constants';
import { StyledSectionBox } from './styled';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page: FC = async () => {
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
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const accountId = session.user.accountId;

    const countPromise = await getFilteredInvoicesByAccountIdCount(accountId, '');
    const latestInvoicesPromise = await getFilteredInvoicesByAccountId(
        accountId,
        '',
        DEFAULT_PAGE_NUMBER,
        DEFAULT_ITEMS_PER_PAGE,
        'date',
        'desc'
    );

    const [count, latestInvoices] = await Promise.all([countPromise, latestInvoicesPromise]);

    const invoices = latestInvoices.map((invoice) => {
        return {
            ...invoice,
            amount: formatCurrency(invoice.amount, userAccountCountry.locale),
            date: invoice.date.toLocaleDateString(userAccountCountry.locale),
            payBy: invoice.payBy.toLocaleDateString(userAccountCountry.locale),
            paidOn: invoice.paidOn?.toLocaleDateString(userAccountCountry.locale)
        };
    });

    return (
        <StyledSectionBox component='section'>
            <Typography variant='h1'>{capitalize(t('dashboard'))}</Typography>
            <Suspense fallback={<CardsSkeleton />}>
                <DashboardCardWrapper locale={userAccountCountry.locale} />
            </Suspense>
            {/* <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense> */}
            <Suspense fallback={<LatestInvoicesSkeleton />}>
                <InvoicesTable invoices={invoices} count={count} tableName='latest invoices' />
            </Suspense>
        </StyledSectionBox>
    );
};
export default Page;
