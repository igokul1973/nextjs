import DashboardCard from '@/app/components/dashboard/dashboard-card/DashboardCard';
import { getCardData } from '@/app/lib/data/card';
import { formatCurrencyAsCents, getApp } from '@/app/lib/utils';
import { FC } from 'react';
import { StyledCardWrapper } from './styled';

const DashboardCardWrapper: FC = async () => {
    const userPromise = getApp();
    const cardDataPromise = getCardData();

    const [
        { provider },
        {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices: totalPaidInvoicesNum,
            totalPendingInvoices: totalPendingInvoicesNum
        }
    ] = await Promise.all([userPromise, cardDataPromise]);

    const locale = provider.address.country.locale;

    const totalPaidInvoices = formatCurrencyAsCents(totalPaidInvoicesNum ?? '0', locale);
    const totalPendingInvoices = formatCurrencyAsCents(totalPendingInvoicesNum ?? '0', locale);

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
