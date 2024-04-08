import Form from '@/app/components/inventory/create-form/Form';
import { auth } from '@/auth';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import styles from './page.module.scss';

export default async function Page() {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;

    return (
        <main className={styles.wrapper}>
            <Typography variant='h1'>Create Inventory</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/inventory'
                >
                    Inventory
                </Link>
                <Typography color='text.primary'>Create Inventory</Typography>
            </Breadcrumbs>
            <Form />
            <div>TBD</div>
        </main>
    );
}
