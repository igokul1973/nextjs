import Loading from '@/app/components/loading/Loading';
import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import CreateInventoryFormData from './CreateInventoryFormData';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    return (
        <StyledBox component='main'>
            <Typography variant='h1'>{capitalize(t('create inventory item'))}</Typography>
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
            <Suspense fallback={<Loading />}>
                <CreateInventoryFormData params={{ locale }} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
