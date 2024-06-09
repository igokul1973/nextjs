import { TEntity } from '@/app/lib/types';
import { getProviderName } from '@/app/lib/utils';
import { InvoiceStatusEnum } from '@prisma/client';
import { TInvoiceForm, TInvoiceItem } from './form/types';

export const getDefaultFormValues = (userId: string, provider: TEntity): TInvoiceForm => {
    return {
        id: '',
        number: '',
        date: new Date(),
        status: InvoiceStatusEnum.draft,
        customer: null,
        providerName: getProviderName(provider),
        providerAddressLine1: provider.address.addressLine1,
        providerAddressLine2: provider.address.addressLine2,
        providerAddressLine3: provider.address.addressLine3,
        providerLocality: provider.address.locality,
        providerRegion: provider.address.region,
        providerPostCode: provider.address.postcode,
        providerCountry: provider.address.country.name,
        providerPhone: provider.phones[0].number,
        providerEmail: provider.emails[0].email,
        providerLogoId: null,
        purchaseOrderNumbers: [],
        manufacturerInvoiceNumbers: [],
        additionalInformation: '',
        payBy: null,
        paidOn: null,
        paymentInfo: '',
        paymentTerms: '',
        deliveryTerms: '',
        terms: '',
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
            salesTax: 0,
            discount: 0,
            inventoryId: '',
            measurementUnit: null,
            createdBy: userId,
            updatedBy: userId
        }
    ];
};
