import { CardsSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import CardWrapper from '../../ui/dashboard/card-wrapper/CardWrapper';
import LatestInvoices from '../../ui/dashboard/latest-invoices';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

revalidatePath('/dashboard');

export default async function Page() {
    return (
        <main>
            <h1>Dashboard</h1>
            <div className={styles.card}>
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
        </main>
    );
}
