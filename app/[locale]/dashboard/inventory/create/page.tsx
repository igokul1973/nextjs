import InventoryForm from '@/app/components/inventory/create-form/InventoryForm';
import Warning from '@/app/components/warning/Warning';
import { getInventoryTypes } from '@/app/lib/data/inventory-type';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { StyledBox } from './styled';

const Page: FC = async () => {
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
    const types = await getInventoryTypes();

    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;
    const isDataLoaded = !!userAccountCountry;

    if (!isDataLoaded) {
        return <Warning variant='h4'>{capitalize(t('could not load data'))}</Warning>;
    }

    return (
        <StyledBox component='main'>
            <Typography variant='h1'>{capitalize(t('create inventory'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/inventory'
                >
                    {capitalize(t('inventory'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('create inventory'))}</Typography>
            </Breadcrumbs>
            <InventoryForm types={types} />
        </StyledBox>
    );
};

export default Page;
