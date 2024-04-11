import Form from '@/app/components/invoices/create-form/Form';
import { getCustomersByAccountId } from '@/app/lib/data/customers';
import { auth } from '@/auth';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { StyledBox } from './styled';

export default async function Page() {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;

    const customers = await getCustomersByAccountId(session.user.accountId);

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>Create Invoice</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    Invoices
                </Link>
                <Typography color='text.primary'>Create Invoices</Typography>
            </Breadcrumbs>
            <Form customers={customers} />
            <div>TBD</div>
        </StyledBOx>
    );
}
