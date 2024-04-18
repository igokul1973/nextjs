import CustomerForm from '@/app/components/customers/create-form/CustomerForm';
import Warning from '@/app/components/warning/Warning';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { StyledBox } from './styled';

export default async function Page() {
    const t = await getI18n();
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const { provider, providerType } = session;
    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;
    const localIdentifierNames =
        userAccountCountry && (await getLocalIdentifierNamesByCountryId(userAccountCountry?.id));
    const isDataLoaded =
        !!provider && !!providerType && !!userAccountCountry && !!localIdentifierNames;

    return (
        <StyledBox component='main' className='wrapper'>
            <Typography variant='h1'>{capitalize(t('create customer'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/customers'
                >
                    {capitalize(t('customers'))}
                </Link>
                <Typography color='text.primary'> {capitalize(t('create customer'))}</Typography>
            </Breadcrumbs>
            {(isDataLoaded && (
                <CustomerForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierNames={localIdentifierNames}
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
