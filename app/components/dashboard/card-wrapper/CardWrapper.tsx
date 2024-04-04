import Card from '@/app/components/dashboard/card/Card';
import { fetchCardData } from '@/app/lib/data/card';
import styles from './CardWrapper.module.scss';

export default async function CardWrapper() {
    const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } =
        await fetchCardData();
    return (
        <div className={styles['cards-wrapper']}>
            <Card title='Collected' value={totalPaidInvoices} type='collected' />
            <Card title='Pending' value={totalPendingInvoices} type='pending' />
            <Card title='Total Invoices' value={numberOfInvoices} type='invoices' />
            <Card title='Total Customers' value={numberOfCustomers} type='customers' />
        </div>
    );
}
