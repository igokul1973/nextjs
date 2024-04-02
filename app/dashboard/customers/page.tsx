import CustomersTable from '@/app/components/customers/table';
import { CreateButton } from '@/app/components/invoices/buttons';
import Pagination from '@/app/components/invoices/pagination';
import Search from '@/app/components/search';
import { InvoicesTableSkeleton } from '@/app/components/skeletons';
import { fetchFilteredCustomers, fetchFilteredCustomersCount } from '@/app/lib/data/customers';
import { ISearchParams } from '@/app/lib/definitions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Suspense } from 'react';

interface IProps {
    searchParams: ISearchParams;
}

export default async function Page({ searchParams }: IProps) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchFilteredCustomersCount(query);
    const customers = await fetchFilteredCustomers(query, currentPage);

    return (
        <Box component='main'>
            <Typography variant='h1'>Customers</Typography>
            <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
                <Search placeholder='Search customers...' />
                <CreateButton href='/dashboard/customers/create' name='Create customer' />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <CustomersTable customers={customers} />
            </Suspense>
            <div className='mt-5 flex w-full justify-center'>
                <Pagination totalPages={totalPages} />
            </div>
        </Box>
    );
}
