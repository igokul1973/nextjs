import Test from '@/app/components/dashboard/leftmenu/Test';
import { fetchFilteredInvoicesCount } from '@/app/lib/data/invoices';
import { ISearchParams } from '@/app/lib/definitions';

interface IProps {
    searchParams: ISearchParams;
}

export default async function Page({ searchParams }: IProps) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchFilteredInvoicesCount(query);

    return (
        // <Test query='query' currentPage={currentPage} totalPages={totalPages} />
        <Test />
        // <Box component='section'>
        //     <Typography variant='h1'>Invoices</Typography>
        //     <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        //         <Search placeholder='Search invoices...' />
        //         <CreateButton href='/dashboard/invoices/create' name='Create invoice' />
        //     </div>
        //     <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        //         <Table query={query} currentPage={currentPage} />
        //     </Suspense>
        //     <div className='mt-5 flex w-full justify-center'>
        //         <Pagination totalPages={totalPages} />
        //     </div>
        // </Box>
    );
}
