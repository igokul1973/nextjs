import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import CustomersTable from '@/app/components/customers/customers-table/CustomersTable';
import Search from '@/app/components/search/search';
import Warning from '@/app/components/warning/Warning';
import { capitalize, stringifyObjectValues } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import { RedirectType, redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import CustomersTableData from './CustomersTableData';
import {
    DEFAULT_IS_DENSE,
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER,
    propsSchema
} from './constants';
import { StyledBox } from './styled';
import { TPageProps } from './types';

const Page: FC<TPageProps> = async (props) => {
    const propsData = propsSchema.safeParse(props);

    if (!propsData.success) {
        return <Warning variant='h4'>Incorrect incoming data</Warning>;
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
    const showOrg = searchParams?.showOrg ?? true;
    const showInd = searchParams?.showInd ?? true;

    const sanitizedSearchParams = {
        query,
        page,
        itemsPerPage,
        showOrg,
        showInd,
        orderBy,
        order,
        isDense
    };

    if (Object.keys(searchParams).length < Object.keys(sanitizedSearchParams).length) {
        const stringifiedSearchParams = stringifyObjectValues(sanitizedSearchParams);
        const params = new URLSearchParams(stringifiedSearchParams);
        const redirectLink = `/dashboard/customers?${params.toString()}`;
        return redirect(redirectLink, RedirectType.replace);
    }
    const t = await getI18n();

    return (
        <StyledBox component='section' className='section'>
            <Typography variant='h1'>{capitalize(t('customers'))}</Typography>
            <Box component='section' className='tools'>
                <Search placeholder={capitalize(t('by name, phone or email'))} />
                <CreateButton
                    href='/dashboard/customers/create'
                    name={capitalize(t('create customer'))}
                />
            </Box>
            <Suspense
                key={query + page}
                fallback={
                    <CustomersTable customers={[]} count={0} searchParams={sanitizedSearchParams} />
                }
            >
                <CustomersTableData searchParams={sanitizedSearchParams} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
