import Breadcrumbs from '@/app/components/invoices/breadcrumbs';
import Form from '@/app/components/invoices/create-form';
import { fetchCustomers } from '@/app/lib/data/customers';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/dashboard/invoices/create',
                        active: true
                    }
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}
