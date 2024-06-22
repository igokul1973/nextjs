import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { TInvoiceForm } from '@/app/components/invoices/form/types';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory/actions';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getFilteredMeasurementUnitsByAccount } from '@/app/lib/data/measurement-unit';
import { getUser, populateForm } from '@/app/lib/utils';
import { InvoiceStatusEnum } from '@prisma/client';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const UpdateInvoiceFormData: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const { user, provider, account, settings } = await getUser();
    const userAccountCountry = provider && provider.address?.country;
    let error: string | null = null;

    if (!userAccountCountry || !settings) {
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

    if (!invoice || invoice.status !== InvoiceStatusEnum.draft) {
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

    let { customerLocalIdentifierNameAbbrev, customerLocalIdentifierValue } = rawForm;

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

    let customer: NonNullable<TInvoiceForm['customer']> = {
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

    const defaultFormValues = getDefaultFormValues(user.id, provider, settings);

    // If the invoice is a draft, we need to set the customer and provider
    // fields' values anew because we do not know if those fields have changed
    // in Customer or Provider respectively from the point in time the invoice
    // was created and now.
    // Else (for all other statuses) - the customer and provider fields' values
    // will stay the same because we fixate all other invoice fields values to
    // a point of time when status changed from the DRAFT to anything else.
    if (invoice.status === InvoiceStatusEnum.draft) {
        // Find customer
        const invoiceCustomer = customers.find((c) => c.customerId === customer.customerId);
        if (!invoiceCustomer) {
            error = 'Invoice customer not found';
        } else {
            customer = invoiceCustomer;
            customerLocalIdentifierNameAbbrev =
                invoiceCustomer.customerLocalIdentifierNameAbbrev ?? null;
            customerLocalIdentifierValue = invoiceCustomer.customerLocalIdentifierValue ?? null;
            // Emptying the provider values because the populateForm() below
            // will eventually add the correct provider values.
            rawForm.providerName = '';
            rawForm.providerAddressLine1 = '';
            rawForm.providerAddressLine2 = null;
            rawForm.providerAddressLine3 = null;
            rawForm.providerLocality = '';
            rawForm.providerRegion = null;
            rawForm.providerPostCode = '';
            rawForm.providerCountry = '';
            rawForm.providerPhone = '';
            rawForm.providerEmail = '';
            rawForm.providerLogoId = '';
            rawForm.providerLocalIdentifierNameAbbrev = null;
            rawForm.providerLocalIdentifierValue = null;
        }
    }

    const form = {
        ...rawForm,
        customer,
        customerLocalIdentifierNameAbbrev,
        customerLocalIdentifierValue,
        date: new Date(date),
        invoiceItems: preparedInvoiceItems
    };

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const defaultValues = populateForm<TInvoiceForm>(defaultFormValues, form);

    return error ? (
        <Warning variant='h4'>{error}</Warning>
    ) : (
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
