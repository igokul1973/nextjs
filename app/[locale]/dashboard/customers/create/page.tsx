import CustomerForm from '@/app/components/customers/create-form/CustomerForm';
import Warning from '@/app/components/warning/Warning';
import { getCountries } from '@/app/lib/data/countries';
import { auth } from '@/auth';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { StyledBox } from './styled';

export default async function Page() {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const countries = await getCountries();
    const { provider, providerType } = session;
    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;

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
            {(!!provider && !!providerType && !!userAccountCountry && (
                <CustomerForm countries={countries} userAccountCountry={userAccountCountry} />
            )) || (
                <Warning variant='h4'>
                    Before creating customers please register yourself as a provider.
                </Warning>
            )}
        </StyledBox>
    );
}
