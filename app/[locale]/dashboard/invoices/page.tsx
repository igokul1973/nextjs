import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import {
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY
} from '@/app/components/invoices/invoices-table/constants';
import Search from '@/app/components/search/search';
import Warning from '@/app/components/warning/Warning';
import {
    getFilteredInvoicesByAccountId,
    getFilteredInvoicesByAccountIdCount
} from '@/app/lib/data/invoice';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from './constants';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ searchParams }) => {
    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const accountId = session.user.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;
    const t = await getI18n();

    const count = await getFilteredInvoicesByAccountIdCount(accountId, query);
    const rawInvoices = await getFilteredInvoicesByAccountId(
        accountId,
        query,
        currentPage,
        itemsPerPage,
        orderBy,
        order
    );

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);
    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider?.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before listing invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const invoices = rawInvoices.map((invoice) => {
        return {
            ...invoice,
            date: invoice.date.toLocaleDateString(userAccountCountry.locale),
            payBy: invoice.payBy.toLocaleDateString(userAccountCountry.locale),
            paidOn: invoice.paidOn?.toLocaleDateString(userAccountCountry.locale)
        };
    });

    return (
        <StyledBox component='section' className='section'>
            <Typography variant='h1'>{capitalize(t('invoices'))}</Typography>
            <Box component='section' className='tools'>
                <Search placeholder={capitalize(t('search invoices'))} />
                <CreateButton
                    href='/dashboard/invoices/create'
                    name={capitalize(t('create invoice'))}
                />
            </Box>
            <Suspense
                key={query + currentPage}
                fallback={<InvoicesTable invoices={[]} count={0} />}
            >
                <InvoicesTable invoices={invoices} count={count} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
