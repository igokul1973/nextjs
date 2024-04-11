import DashboardCard from '@/app/components/dashboard/dashboard-card/DashboardCard';
import { fetchCardData } from '@/app/lib/data/card';
import { FC } from 'react';
import { StyledCardWrapper } from './styled';

const DashboardCardWrapper: FC = async () => {
    const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } =
        await fetchCardData();
    return (
        <StyledCardWrapper>
            <DashboardCard title='collected' value={totalPaidInvoices} type='collected' />
            <DashboardCard title='pending' value={totalPendingInvoices} type='pending' />
            <DashboardCard title='total invoices' value={numberOfInvoices} type='invoices' />
            <DashboardCard title='total customers' value={numberOfCustomers} type='customers' />
        </StyledCardWrapper>
    );
};
export default DashboardCardWrapper;
