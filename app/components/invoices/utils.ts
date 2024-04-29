import { InvoiceStatusEnum } from '@prisma/client';
import { TInvoiceForm, TInvoiceItem } from './form/types';

export const getDefaultFormValues = (userId: string): TInvoiceForm => {
    return {
        id: '',
        number: '',
        date: new Date(),
        status: InvoiceStatusEnum.draft,
        customerId: '',
        customerName: '',
        customerAddressLine1: '',
        customerAddressLine2: '',
        customerAddressLine3: '',
        customerLocality: '',
        customerRegion: '',
        customerPostalCode: '',
        customerCountry: '',
        customerPhone: '',
        customerEmail: '',
        providerPhone: '',
        providerEmail: '',
        purchaseOrderNumbers: [],
        manufacturerInvoiceNumbers: [],
        additionalInformation: '',
        payBy: null,
        paidOn: null,
        billingInfo: '',
        terms: '',
        tax: 0,
        discount: 0,
        notes: '',
        invoiceItems: getInoiceItemsInitial(userId),
        createdBy: userId,
        updatedBy: userId
    };
};

export const getInoiceItemsInitial = (userId: string): TInvoiceItem[] => {
    return [
        {
            id: '',
            name: '',
            price: null,
            quantity: 1,
            inventoryId: '',
            createdBy: userId,
            updatedBy: userId
        }
    ];
};
