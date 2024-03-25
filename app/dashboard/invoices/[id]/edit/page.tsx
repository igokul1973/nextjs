import { fetchCustomers } from '@/app/lib/data/customers';
import { fetchInvoiceById } from '@/app/lib/data/invoices';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/edit-form';
import { notFound } from 'next/navigation';

const Page = async ({ params: { id } }: { params: { id: string } }) => {
    const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomers()]);
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
