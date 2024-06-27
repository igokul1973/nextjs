import Loading from '@/app/components/loading/Loading';
import { capitalize } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import { IProps } from './types';
// import CreateCustomerFormData from './CreateCustomerFormData';
import CreateCustomerForm from '@/app/components/customers/form/CustomerForm';
import { StyledBox } from './styled';

const Page: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();

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
            <Suspense fallback={<Loading />}>
                {/* <CreateCustomerFormData params={{ locale }} /> */}
                <CreateCustomerForm />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
