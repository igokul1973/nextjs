import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/components/skeletons';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import CardWrapper from '../../../components/dashboard/card-wrapper/CardWrapper';
import LatestInvoices from '../../../components/dashboard/latest-invoices';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
    return (
        <Box component='section' className={styles.section}>
            <Typography variant='h1'>Dashboard</Typography>
            <Suspense fallback={<CardsSkeleton />}>
                <CardWrapper />
            </Suspense>
            {/* <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense> */}
            <Suspense fallback={<LatestInvoicesSkeleton />}>
                <LatestInvoices />
            </Suspense>
        </Box>
    );
}
