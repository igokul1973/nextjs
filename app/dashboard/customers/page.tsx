import { fetchFilteredCustomers, fetchFilteredCustomersCount } from '@/app/lib/data/customers';
import { ISearchParams } from '@/app/lib/definitions';
import CustomersTable from '@/app/ui/customers/table';
import { lusitana } from '@/app/ui/fonts';
import { CreateButton } from '@/app/ui/invoices/buttons';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
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
        <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
                <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
            </div>
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
        </div>
    );
}
