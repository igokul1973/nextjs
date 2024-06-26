import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import {
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY
} from '@/app/components/invoices/invoices-table/constants';
import Search from '@/app/components/search/search';
import Warning from '@/app/components/warning/Warning';
import { capitalize, stringifyObjectValues } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import { RedirectType, redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import InvoicesTableData from './InvoicesTableData';
import {
    DEFAULT_IS_DENSE,
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_PAGE_NUMBER,
    propsSchema
} from './constants';
import { StyledBox } from './styled';
import { TPageProps } from './types';

const Page: FC<TPageProps> = async (props) => {
    const propsData = propsSchema.safeParse(props);

    if (!propsData.success) {
        return <Warning variant='h4'>Incorrect URL params</Warning>;
    }

    const {
        params: { locale },
        searchParams
    } = propsData.data;

    setStaticParamsLocale(locale);

    const query = searchParams?.query || '';
    const page = searchParams?.page || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = searchParams?.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;
    const isDense = searchParams?.isDense ?? DEFAULT_IS_DENSE;

    const sanitizedSearchParams = {
        query,
        page,
        itemsPerPage,
        orderBy,
        order,
        isDense
    };

    if (Object.keys(searchParams).length < Object.keys(sanitizedSearchParams).length) {
        const stringifiedSearchParams = stringifyObjectValues(sanitizedSearchParams);
        const params = new URLSearchParams(stringifiedSearchParams);
        const redirectLink = `/dashboard/invoices?${params.toString()}`;
        return redirect(redirectLink, RedirectType.push);
    }
    const t = await getI18n();

    return (
        <StyledBox component='section' className='section'>
            <Typography variant='h1'>{capitalize(t('invoices'))}</Typography>
            <Box component='section' className='tools'>
                <Search placeholder={capitalize(t('search invoices'))} />
                <CreateButton
                    href='/dashboard/invoices/create'
                    name={capitalize(t('create invoice'))}
                />
            </Box>
            <Suspense
                key={query + page}
                fallback={
                    <InvoicesTable invoices={[]} count={0} searchParams={sanitizedSearchParams} />
                }
            >
                <InvoicesTableData searchParams={sanitizedSearchParams} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
