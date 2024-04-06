import Form from '@/app/components/customers/create-form/create-form';
import { getCustomersByAccountId } from '@/app/lib/data/customers';
import { auth } from '@/auth';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import styles from './page.module.scss';

export default async function Page() {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;

    const customers = await getCustomersByAccountId(session.user.accountId);

    return (
        <main className={styles.wrapper}>
            <Typography variant='h1'>Create Customer</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/customers'
                >
                    Customers
                </Link>
                <Typography color='text.primary'>Create Customers</Typography>
            </Breadcrumbs>
            <Form customers={customers} />
        </main>
    );
}
