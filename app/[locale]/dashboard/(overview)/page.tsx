import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/components/skeletons';
import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import CardWrapper from '../../../components/dashboard/card-wrapper/CardWrapper';
import LatestInvoices from '../../../components/dashboard/latest-invoices';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
    const t = await getI18n();
    return (
        <Box component='section' className={styles.section}>
            <Typography variant='h1'>{capitalize(t('dashboard'))}</Typography>
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
