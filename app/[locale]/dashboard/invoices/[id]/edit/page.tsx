import Loading from '@/app/components/loading/Loading';
import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import { StyledBox } from '../../styled';
import UpdateInvoiceFormData from './UpdateInvoiceFormData';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { id, locale }, searchParams: { number } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>
                {capitalize(t('update invoice'))} # {number}
            </Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    {capitalize(t('invoices'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('update invoice'))}</Typography>
            </Breadcrumbs>
            <Suspense fallback={<Loading />}>
                <UpdateInvoiceFormData params={{ id, locale }} searchParams={{ number }} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
