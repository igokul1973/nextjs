import InventoryForm from '@/app/components/inventory/form/InventoryForm';
import { getDefaultFormValues } from '@/app/components/inventory/utils';
import Warning from '@/app/components/warning/Warning';
import { getInventoryItemById } from '@/app/lib/data/inventory';
import { getInventoryTypes } from '@/app/lib/data/inventory-type';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, populateForm } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { id } }) => {
    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const { id: accountId } = dbUser.account;

    const types = await getInventoryTypes();
    const inventoryItem = await getInventoryItemById(id);
    const isDataLoaded = !!types.length && inventoryItem;

    if (!isDataLoaded) {
        return <Warning variant='h4'>{capitalize(t('could not load data'))}</Warning>;
    }

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const form = populateForm(getDefaultFormValues(accountId, sessionUser.id), inventoryItem);

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
            <InventoryForm types={types} form={form} />
        </StyledBox>
    );
};

export default Page;
