import { dateFormats, emailTypes, phoneTypes } from './constants';

export const getDefaultValues = (accountId: string, userId: string) => ({
    id: '',
    dateFormat: dateFormats[0],
    providerInvoicePhoneType: phoneTypes[0],
    providerInvoiceEmailType: emailTypes[0],
    paymentInformation: '',
    paymentTerms: '',
    deliveryTerms: '',
    terms: '',
    salesTax: 0,
    isDisplayCustomerLocalIdentifier: false,
    isObfuscateCustomerLocalIdentifier: false,
    isDisplayProviderLocalIdentifier: false,
    isObfuscateProviderLocalIdentifier: false,
    accountId,
    createdBy: userId,
    updatedBy: userId
});
