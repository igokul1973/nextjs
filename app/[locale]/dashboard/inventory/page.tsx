import {
    DEFAULT_IS_DENSE,
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER,
    propsSchema
} from '@/app/[locale]/dashboard/inventory/constants';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InventoryTable from '@/app/components/inventory/inventory-table/InventoryTable';
import Search from '@/app/components/search/search';
import Warning from '@/app/components/warning/Warning';
import { capitalize, stringifyObjectValues } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import { RedirectType, redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import InventoryTableData from './InventoryTableData';
import { StyledSectionBox, StyledToolsBox } from './styled';
import { IProps } from './types';

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
        const redirectLink = `/dashboard/inventory?${params.toString()}`;
        return redirect(redirectLink, RedirectType.replace);
    }

    const t = await getI18n();

    return (
        <StyledSectionBox component='section'>
            <Typography variant='h1'>{capitalize(t('inventory'))}</Typography>
            <StyledToolsBox component='div'>
                <Search placeholder='Search inventory...' />
                <CreateButton
                    href='/dashboard/inventory/create'
                    name={capitalize(t('create inventory item'))}
                />
            </StyledToolsBox>
            <Suspense
                key={query + page}
                fallback={
                    <InventoryTable
                        inventory={[]}
                        count={0}
                        sanitizedSearchParams={sanitizedSearchParams}
                    />
                }
            >
                <InventoryTableData searchParams={sanitizedSearchParams} />
            </Suspense>
        </StyledSectionBox>
    );
};

export default Page;
