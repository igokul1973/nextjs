import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import {
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY
} from '@/app/components/invoices/invoices-table/constants';
import Search from '@/app/components/search/search';
import {
    getFilteredInvoicesByAccountId,
    getFilteredInvoicesByAccountIdCount
} from '@/app/lib/data/invoice';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, Suspense } from 'react';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from './constants';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ searchParams }) => {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const accountId = session.user.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;
    const t = await getI18n();

    const count = await getFilteredInvoicesByAccountIdCount(accountId, query);
    const invoices = await getFilteredInvoicesByAccountId(
        accountId,
        query,
        currentPage,
        itemsPerPage,
        orderBy,
        order
    );

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
