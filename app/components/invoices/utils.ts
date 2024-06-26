import { TEntity, TSettings } from '@/app/lib/types';
import { getProviderName } from '@/app/lib/utils';
import { InvoiceStatusEnum } from '@prisma/client';
import { TInvoiceForm, TInvoiceItem } from './form/types';

export const getDefaultFormValues = (
    userId: string,
    provider: TEntity,
    settings: TSettings
): TInvoiceForm => {
    const defaultPhone =
        provider.phones.find((phone) => phone.type === settings.providerInvoicePhoneType) ||
        provider.phones[0];
    const defaultEmail =
        provider.emails.find((email) => email.type === settings.providerInvoiceEmailType) ||
        provider.emails[0];

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
        providerPhone: `+${defaultPhone.countryCode}-${defaultPhone.number}`,
        providerEmail: defaultEmail.email,
        providerLogoId: null,
        providerLocalIdentifierNameAbbrev: provider.localIdentifierName?.abbreviation ?? '',
        providerLocalIdentifierValue: provider.localIdentifierValue ?? '',
        purchaseOrderNumbers: [],
        manufacturerInvoiceNumbers: [],
        additionalInformation: '',
        payBy: null,
        paidOn: null,
        paymentInfo: settings.paymentInformation ?? '',
        paymentTerms: settings.paymentTerms ?? '',
        deliveryTerms: settings.deliveryTerms ?? '',
        terms: settings.terms ?? '',
        customerLocalIdentifierNameAbbrev: '',
        customerLocalIdentifierValue: '',
        customerRef: '',
        providerRef: '',
        notes: '',
        invoiceItems: getInoiceItemsInitial(userId, settings.salesTax),
        createdBy: userId,
        updatedBy: userId
    };
};

export const getInoiceItemsInitial = (userId: string, salesTax: number = 0): TInvoiceItem[] => {
    return [
        {
            id: '',
            name: '',
            inventoryItem: null,
            price: null,
            quantity: 1,
            salesTax: salesTax / 1000,
            discount: 0,
            inventoryId: '',
            measurementUnit: null,
            createdBy: userId,
            updatedBy: userId
        }
    ];
};
