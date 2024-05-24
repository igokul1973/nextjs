import Loading from '@/app/components/loading/Loading';
import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import UpdateInventoryFormData from './UpdateInventoryFormData';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();

    return (
        <StyledBox component='main'>
            <Typography variant='h1'>{capitalize(t('update inventory item'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/inventory'
                >
                    {capitalize(t('inventory'))}
                </Link>
                <Typography color='text.primary'>
                    {capitalize(t('update inventory item'))}
                </Typography>
            </Breadcrumbs>
            <Suspense fallback={<Loading />}>
                <UpdateInventoryFormData params={{ id, locale }} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
