import { InvoiceStatusEnum } from '@prisma/client';
import { TInvoiceForm, TInvoiceItem } from './form/types';

export const getDefaultFormValues = (
    userId: string,
    providerPhone: string,
    providerEmail: string
): TInvoiceForm => {
    return {
        id: '',
        number: '',
        date: new Date(),
        status: InvoiceStatusEnum.draft,
        customer: null,
        providerPhone,
        providerEmail,
        purchaseOrderNumbers: [],
        manufacturerInvoiceNumbers: [],
        additionalInformation: '',
        payBy: null,
        paidOn: null,
        paymentInfo: '',
        terms: '',
        tax: 0.0,
        discount: 0.0,
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
            inventoryItem: null,
            price: null,
            quantity: 1,
            inventoryId: '',
            createdBy: userId,
            updatedBy: userId
        }
    ];
};