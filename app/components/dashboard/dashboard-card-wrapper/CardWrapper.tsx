import DashboardCard from '@/app/components/dashboard/dashboard-card/DashboardCard';
import { fetchCardData } from '@/app/lib/data/card';
import { formatCurrency } from '@/app/lib/utils';
import { FC } from 'react';
import { StyledCardWrapper } from './styled';
import { IProps } from './types';

const DashboardCardWrapper: FC<IProps> = async ({ locale }) => {
    const {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices: totalPaidInvoicesNum,
        totalPendingInvoices: totalPendingInvoicesNum
    } = await fetchCardData();

    const totalPaidInvoices = formatCurrency(totalPaidInvoicesNum ?? '0', locale);
    const totalPendingInvoices = formatCurrency(totalPendingInvoicesNum ?? '0', locale);

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
