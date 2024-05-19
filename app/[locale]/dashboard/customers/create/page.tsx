import CustomerForm from '@/app/components/customers/form/CustomerForm';
import Warning from '@/app/components/warning/Warning';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { IProps } from '../types';
import { StyledBox } from './styled';

const Page: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);

    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;
    const localIdentifierNames =
        userAccountCountry && (await getLocalIdentifierNamesByCountryId(userAccountCountry?.id));
    const isDataLoaded = !!userAccountCountry && !!localIdentifierNames;

    if (!isDataLoaded) {
        return (
            <Warning variant='h4'>
                Before creating customers please register yourself as a Provider, seed the Countries
                and Local Identifier names.
            </Warning>
        );
    }

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
            <CustomerForm
                userAccountCountry={userAccountCountry}
                localIdentifierNames={localIdentifierNames}
            />
        </StyledBox>
    );
};

export default Page;
