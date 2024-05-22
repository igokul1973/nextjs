import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { TInvoiceForm } from '@/app/components/invoices/form/types';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getUser, populateForm } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const UpdateInvoiceFormData: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    const { user, provider, account } = await getUser();
    const userAccountCountry = provider && provider.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const invoicePromise = getInvoiceById(id, account.id);
    const customersPromise = getCustomersByAccountId(account.id);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw(account.id, '', 0, 50);
    const [invoice, customers, rawInventory] = await Promise.all([
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
        ...rawForm
    } = invoice;

    const preparedInvoiceItems = invoiceItems.map((invoiceItem) => {
        const { price: rawPrice, ...partialInvoiceItem } = invoiceItem;

        return {
            price: rawPrice / 100,
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
        customerEmail
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
