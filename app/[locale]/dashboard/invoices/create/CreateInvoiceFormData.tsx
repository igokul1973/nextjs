import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory/actions';
import { getFilteredMeasurementUnitsByAccount } from '@/app/lib/data/measurement-unit';
import { getApp } from '@/app/lib/utils';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from './types';

const CreateInvoiceFormData: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);
    const { user, provider, account, settings } = await getApp();

    const userAccountCountry = provider.address.country;

    const measurementUnitsPromise = getFilteredMeasurementUnitsByAccount({
        accountId: account.id,
        query: ''
    });
    const customersPromise = getCustomersByAccountId(account.id);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw({
        accountId: account.id,
        query: '',
        page: 0,
        itemsPerPage: 50
    });

    const [measurementUnits, customers, rawInventory] = await Promise.all([
        measurementUnitsPromise,
        customersPromise,
        inventoryPromise
    ]);

    const inventory = rawInventory.map((rawInventoryItem) => {
        const {
            price: rawPrice,
            manufacturerPrice: rawManufacturerPrice,
            ...partialInventoryItem
        } = rawInventoryItem;

        return {
            price: rawPrice / 100,
            manufacturerPrice: rawManufacturerPrice === null ? null : rawManufacturerPrice / 100,
            ...partialInventoryItem
        };
    });

    const defaultValues = getDefaultFormValues(user.id, provider, settings);

    return (
        <InvoiceForm
            customers={customers}
            inventory={inventory}
            measurementUnits={measurementUnits}
            accountId={account.id}
            locale={userAccountCountry.locale}
            providerPhones={provider.phones}
            providerEmails={provider.emails}
            defaultValues={defaultValues}
            isEdit={false}
        />
    );
};
export default CreateInvoiceFormData;
