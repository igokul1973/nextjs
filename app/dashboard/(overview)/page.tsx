import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/components/skeletons';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import CardWrapper from '../../components/dashboard/card-wrapper/CardWrapper';
import LatestInvoices from '../../components/dashboard/latest-invoices';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

revalidatePath('/dashboard');

export default async function Page() {
    return (
        <Box>
            <Typography variant='h1'>Dashboard</Typography>
            <div className={styles['cards-wrapper']}>
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className={styles['latest-invoices']}>
                {/* <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense> */}
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </Box>
    );
}
