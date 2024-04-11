import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InvoicesTable from '@/app/components/invoices/InvoicesTable';
import TableWrapper from '@/app/components/invoices/TableWrapper';
import Search from '@/app/components/search';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Typography from '@mui/material/Typography';
import { FC, Suspense } from 'react';
import { StyledSectionBox, StyledToolsBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ searchParams }) => {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const query = searchParams?.query || '';
    const t = await getI18n();

    // TODO: change to a paginated table
    // const count = await fetchFilteredInvoicesCount(query);

    // TODO:
    // Resolve all problems with Invoices (list) page
    // 1. Pagination
    // 2. Filtering by date
    // 3. Sorting by all columns
    // 4. Add breadcrumbs everywhere
    // Then, create View Invoice page
    // Then, create Create Invoice page
    // Then, create inventory page

    return (
        <StyledSectionBox component='section'>
            <Typography variant='h1'>{capitalize(t('invoices'))}</Typography>
            <StyledToolsBox component='div'>
                <Search placeholder='Search invoices...' />
                <CreateButton href='/dashboard/invoices/create' name='Create invoice' />
            </StyledToolsBox>
            <Suspense fallback={<InvoicesTable invoices={[]} />}>
                <TableWrapper accountId={session.user.accountId} query={query} />
            </Suspense>
        </StyledSectionBox>
    );
};

export default Page;
