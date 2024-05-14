import DashboardCardWrapper from '@/app/components/dashboard/dashboard-card-wrapper/CardWrapper';
import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/components/skeletons';
import { capitalize, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { StyledSectionBox } from './styled';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import Warning from '@/app/components/warning/Warning';
import { getLatestInvoices } from '@/app/lib/data/invoice';
import LatestInvoices from '@/app/components/dashboard/latest-invoices/latest-invoices';

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

    const latestInvoices = await getLatestInvoices(userAccountCountry.locale);

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
                <LatestInvoices latestInvoices={latestInvoices} />
            </Suspense>
        </StyledSectionBox>
    );
};
export default Page;
