import InventoryForm from '@/app/components/inventory/form/InventoryForm';
import Warning from '@/app/components/warning/Warning';
import { getInventoryItemById } from '@/app/lib/data/inventory';
import { getInventoryTypes } from '@/app/lib/data/inventory-type';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize } from '@/app/lib/utils';
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

    const types = await getInventoryTypes();
    const inventoryItem = await getInventoryItemById(id);
    const isDataLoaded = !!types.length && inventoryItem;

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
            <InventoryForm types={types} form={inventoryItem} />
        </StyledBox>
    );
};

export default Page;
