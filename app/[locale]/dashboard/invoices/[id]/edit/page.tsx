import Form from '@/app/components/invoices/edit-form';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { fetchInvoiceById } from '@/app/lib/data/invoice';
import { auth } from '@/auth';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { notFound } from 'next/navigation';

const Page = async ({ params: { id } }: { params: { id: string } }) => {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        getCustomersByAccountId(session.user.accountId)
    ]);
    if (!invoice) {
        notFound();
    }
    return (
        <Box component='main'>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    Invoices
                </Link>
                <Typography color='text.primary'>Edit Invoice ${id}</Typography>
            </Breadcrumbs>
            <Form invoice={invoice} customers={customers} />
        </Box>
    );
};

export default Page;
