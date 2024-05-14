import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { StyledBox } from './styled';

export default async function Page() {
    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');
    const accountId = session.user.accountId;

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);

    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const customersPromise = getCustomersByAccountId(session.user.accountId);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw(accountId, '', 0, 50);
    const [customers, inventory] = await Promise.all([customersPromise, inventoryPromise]);

    const defaultValues = getDefaultFormValues(sessionUser.id, userAccountProvider);

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
            <InvoiceForm
                customers={customers}
                inventory={inventory}
                accountId={accountId}
                locale={userAccountCountry.locale}
                providerPhones={userAccountProvider.phones}
                providerEmails={userAccountProvider.emails}
                defaultValues={defaultValues}
                isEdit={false}
            />
        </StyledBox>
    );
}
