import CustomerForm from '@/app/components/customers/create-form/CustomerForm';
import { auth } from '@/auth';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { StyledBox } from './styled';

export default async function Page() {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;

    return (
        <StyledBox component='main' className='wrapper'>
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
            <CustomerForm />
            <div>TBD</div>
        </StyledBox>
    );
}
