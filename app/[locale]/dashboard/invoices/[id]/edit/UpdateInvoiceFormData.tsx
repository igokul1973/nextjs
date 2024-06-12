import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { TInvoiceForm } from '@/app/components/invoices/form/types';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getFilteredMeasurementUnitsByAccount } from '@/app/lib/data/measurement-unit';
import { getUser, populateForm } from '@/app/lib/utils';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const UpdateInvoiceFormData: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const { user, provider, account } = await getUser();
    const userAccountCountry = provider && provider.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const measurementUnitsPromise = getFilteredMeasurementUnitsByAccount({
        accountId: account.id,
        query: ''
    });
    const invoicePromise = getInvoiceById(id, account.id);
    const customersPromise = getCustomersByAccountId(account.id);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw({
        accountId: account.id,
        query: '',
        page: 0,
        itemsPerPage: 50
    });
    const [measurementUnits, invoice, customers, rawInventory] = await Promise.all([
        measurementUnitsPromise,
        invoicePromise,
        customersPromise,
        inventoryPromise
    ]);

    if (!invoice) {
        notFound();
    }

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

    const {
        date,
        invoiceItems,
        customerId,
        customerName,
        customerAddressLine1,
        customerAddressLine2,
        customerAddressLine3,
        customerLocality,
        customerRegion,
        customerPostCode,
        customerCountry,
        customerPhone,
        customerEmail,
        customerLocalIdentifierNameAbbrev,
        customerLocalIdentifierValue,
        ...rawForm
    } = invoice;

    const preparedInvoiceItems = invoiceItems.map((invoiceItem) => {
        const {
            price: rawPrice,
            quantity: rawQuantity,
            discount: rawDiscount,
            salesTax: rawSalesTax,
            ...partialInvoiceItem
        } = invoiceItem;

        return {
            price: rawPrice / 100,
            quantity: rawQuantity / 1000,
            discount: rawDiscount / 100,
            salesTax: rawSalesTax / 1000,
            inventoryItem: {
                id: partialInvoiceItem.inventoryId,
                name: partialInvoiceItem.name
            },
            ...partialInvoiceItem
        };
    });

    const customer = {
        customerId,
        customerName,
        customerAddressLine1,
        customerAddressLine2,
        customerAddressLine3,
        customerLocality,
        customerRegion,
        customerPostCode,
        customerCountry,
        customerPhone,
        customerEmail,
        customerLocalIdentifierNameAbbrev,
        customerLocalIdentifierValue
    };

    const form = { ...rawForm, customer, date: new Date(date), invoiceItems: preparedInvoiceItems };

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const defaultValues = populateForm<TInvoiceForm>(getDefaultFormValues(user.id, provider), form);

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
            isEdit={true}
        />
    );
};

export default UpdateInvoiceFormData;
