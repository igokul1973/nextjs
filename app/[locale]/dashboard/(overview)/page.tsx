import DashboardCardWrapper from '@/app/components/dashboard/dashboard-card-wrapper/CardWrapper';
import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import { CardsSkeleton } from '@/app/components/skeletons';
import Warning from '@/app/components/warning/Warning';
import { capitalize, stringifyObjectValues } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Typography } from '@mui/material';
import { setStaticParamsLocale } from 'next-international/server';
import { RedirectType, redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import InvoicesTableData from '../invoices/InvoicesTableData';
import {
    DEFAULT_IS_DENSE,
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER,
    propsSchema
} from '../invoices/constants';
import { StyledSectionBox } from './styled';
import { IProps } from './types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page: FC<IProps> = async (props) => {
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
        const redirectLink = `/dashboard?${params.toString()}`;
        return redirect(redirectLink, RedirectType.replace);
    }

    const t = await getI18n();

    return (
        <StyledSectionBox component='section'>
            <Typography variant='h1'>{capitalize(t('dashboard'))}</Typography>
            <Suspense fallback={<CardsSkeleton />}>
                <DashboardCardWrapper />
            </Suspense>
            {/* <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense> */}
            <Suspense
                key={query + page}
                fallback={
                    <InvoicesTable invoices={[]} count={0} searchParams={sanitizedSearchParams} />
                }
            >
                <InvoicesTableData
                    searchParams={sanitizedSearchParams}
                    tableName='latest invoices'
                />
            </Suspense>
        </StyledSectionBox>
    );
};
export default Page;
