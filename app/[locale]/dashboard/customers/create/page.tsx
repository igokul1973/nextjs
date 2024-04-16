import CustomerForm from '@/app/components/customers/create-form/CustomerForm';
import Warning from '@/app/components/warning/Warning';
import { getCountries } from '@/app/lib/data/country';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { auth } from '@/auth';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { StyledBox } from './styled';
import { getOrganizationTypes } from '@/app/lib/data/organization-type';

export default async function Page() {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const countries = await getCountries();
    const organizationTypes = await getOrganizationTypes();
    const { provider, providerType } = session;
    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;
    const localIdentifierNames =
        userAccountCountry && (await getLocalIdentifierNamesByCountryId(userAccountCountry?.id));
    const isDataLoaded =
        !!provider && !!providerType && !!userAccountCountry && !!localIdentifierNames;

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
            {(isDataLoaded && (
                <CustomerForm
                    countries={countries}
                    userAccountCountry={userAccountCountry}
                    localIdentifierNames={localIdentifierNames}
                    organizationTypes={organizationTypes}
                />
            )) || (
                <Warning variant='h4'>
                    Before creating customers please register yourself as a Provider, seed the
                    Countries and Local Identifier names.
                </Warning>
            )}
        </StyledBox>
    );
}
