import DashboardCard from '@/app/components/dashboard/dashboard-card/DashboardCard';
import Warning from '@/app/components/warning/Warning';
import { getCardData } from '@/app/lib/data/card';
import { formatCurrencyAsCents, getUser } from '@/app/lib/utils';
import { FC } from 'react';
import { StyledCardWrapper } from './styled';

const DashboardCardWrapper: FC = async () => {
    const userPromise = getUser();
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

    const locale = provider?.address?.country.locale;

    if (!locale) {
        return (
            <Warning variant='h4'>
                Before listing invoice data please register yourself as a Provider.
            </Warning>
        );
    }

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
