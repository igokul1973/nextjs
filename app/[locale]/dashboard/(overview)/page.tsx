import DashboardCardWrapper from '@/app/components/dashboard/dashboard-card-wrapper/CardWrapper';
import LatestInvoices from '@/app/components/dashboard/latest-invoices';
import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/components/skeletons';
import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { StyledSectionBox } from './styled';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page: FC = async () => {
    const t = await getI18n();
    return (
        <StyledSectionBox component='section'>
            <Typography variant='h1'>{capitalize(t('dashboard'))}</Typography>
            <Suspense fallback={<CardsSkeleton />}>
                <DashboardCardWrapper />
            </Suspense>
            {/* <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense> */}
            <Suspense fallback={<LatestInvoicesSkeleton />}>
                <LatestInvoices />
            </Suspense>
        </StyledSectionBox>
    );
};
export default Page;
