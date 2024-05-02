import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { StyledBox } from './styled';

export default async function Page() {
    const t = await getI18n();

    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const accountId = session.user.accountId;

    const customersPromise = getCustomersByAccountId(session.user.accountId);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw(accountId, '', 0, 50);
    const [customers, inventory] = await Promise.all([customersPromise, inventoryPromise]);

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>{capitalize(t('create invoice'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    {capitalize(t('invoices'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('create invoice'))}</Typography>
            </Breadcrumbs>
            <InvoiceForm customers={customers} inventory={inventory} />
        </StyledBox>
    );
}
