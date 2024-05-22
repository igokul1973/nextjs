import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import Loading from '../../(overview)/loading';
import { IProps } from './types';
import CreateInvoiceFormData from './CreateInvoiceFormData';
import { StyledBox } from './styled';

const Page: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);
    const t = await getI18n();

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>{capitalize(t('create invoice'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    {capitalize(t('invoices'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('create invoice'))}</Typography>
            </Breadcrumbs>
            <Suspense fallback={<Loading />}>
                <CreateInvoiceFormData params={{ locale }} />
            </Suspense>
        </StyledBox>
    );
};
export default Page;
