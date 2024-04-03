import Breadcrumbs from '@/app/components/invoices/breadcrumbs';
import Form from '@/app/components/invoices/edit-form';
import { getCustomersByAccountId } from '@/app/lib/data/customers';
import { fetchInvoiceById } from '@/app/lib/data/invoices';
import { auth } from '@/auth';
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
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: `Edit Invoice ${id}`,
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true
                    }
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
};

export default Page;
