import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { auth } from '@/auth';
import { EntitiesEnum, Prisma } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { redirect } from 'next/navigation';
import { ChangeEvent } from 'react';
import { SafeParseReturnType, z } from 'zod';
import {
    getIndividualCreateSchema,
    getIndividualUpdateSchema,
    getIndividualUpdateSchemaEmptyLogo
} from '../components/individuals/form/formSchema.ts';
import {
    TIndividualFormOutput,
    TIndividualFormOutputWithoutLogo
} from '../components/individuals/form/types.ts';
import { TCustomerOutput } from '../components/invoices/form/types';
import {
    getOrganizationCreateSchema,
    getOrganizationUpdateSchema,
    getOrganizationUpdateSchemaEmptyLogo
} from '../components/organizations/form/formSchema.ts';
import {
    TOrganizationFormOutput,
    TOrganizationFormOutputWithoutLogo
} from '../components/organizations/form/types.ts';
import { IUserState } from '../context/user/types';
import { getIndividualFullNameString, getUserProvider } from './commonUtils.ts';
import { TCustomerPayload } from './data/customer/types';
import { TTransformedInvoice } from './data/invoice/types.ts';
import { TGetUserWithRelationsPayload } from './data/user/types';
import { TDirtyFields, TEntities, TIndividual, TTranslateFn } from './types';

export {
    getEntityFirstEmailString,
    getEntityFirstPhoneString,
    getEntityName,
    getIndividualFullNameString,
    getProviderName,
    getUserCustomersPerEntity,
    getUserProvider,
    isIndHasCustomer,
    isOrgHasCustomer
} from './commonUtils.ts';

const localeToCurrencyCode: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'sv-SE': 'SEK',
    'ru-RU': 'RUB'
    // Add more mappings here...
};

const localeToNumeroSign: Record<string, string> = {
    'en-US': '#',
    'en-GB': 'No.',
    'sv-SE': 'nr.',
    'ru-RU': '№'
    // Add more mappings here...
};

export const objectKeys = Object.keys as unknown as <T>(o: T) => (keyof T)[];

export const formatCurrency = (amount: number, locale: string) => {
    const currrencyCode = localeToCurrencyCode[locale];
    return amount.toLocaleString(locale, {
        style: 'currency',
        currency: currrencyCode
    });
};

export const formatCurrencyAsCents = (amount: number, locale: string) => {
    const currrencyCode = localeToCurrencyCode[locale];
    return (amount / 100).toLocaleString(locale, {
        style: 'currency',
        currency: currrencyCode
    });
};

export const formatNumeroSign = (locale: string) => {
    return localeToNumeroSign[locale];
};

export const formatDateToLocal = (dateStr: string, locale: string = 'en-US') => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const formatQuantity = (quantity: number) => {
    return quantity / 1000;
};

export const formatDiscount = (discount: number) => {
    return discount / 100;
};

export const formatSalesTax = (tax: number) => {
    return tax / 1000;
};

export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export function useDebounce<T>(f: (...args: T[]) => unknown, ms = 500) {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: T[]) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            f(...args);
        }, ms);
    };
}

export function flattenCustomer(rawCustomer: TCustomerPayload): TCustomerOutput {
    const entity = rawCustomer.individual ?? rawCustomer.organization;
    if (!entity) {
        throw Error('The customer organization or individual is not found. Please add one first.');
    }

    const customerName =
        'firstName' in entity
            ? getIndividualFullNameString(entity as unknown as TIndividual)
            : entity.name;

    const customerType =
        'firstName' in entity ? EntitiesEnum.individual : EntitiesEnum.organization;
    const customerAddress =
        'firstName' in entity ? rawCustomer.individual?.address : rawCustomer.organization?.address;
    // const customerLocalIdentifierNameAbbrev = 'firstName' in entity ? entity : 'ACN';
    if (!customerAddress) {
        throw Error('Something is not right with the customer address.');
    }

    const nameOrAbbrev = entity.localIdentifierName.abbreviation
        ? entity.localIdentifierName.abbreviation
        : entity.localIdentifierName.name;

    return {
        customerId: rawCustomer.id,
        customerCode: rawCustomer.code,
        customerName,
        customerType,
        customerAddressLine1: customerAddress.addressLine1,
        customerAddressLine2: customerAddress.addressLine2,
        customerAddressLine3: customerAddress.addressLine3,
        customerLocality: customerAddress.locality,
        customerRegion: customerAddress.region,
        customerPostCode: customerAddress.postcode,
        customerCountry: customerAddress.country.name,
        customerPhone: entity.phones.length
            ? `+${entity.phones[0].countryCode}-${entity.phones[0].number}`
            : 'no phone provided',
        customerEmail: entity.emails.length ? entity.emails[0].email : 'no email provided',
        customerLocalIdentifierNameAbbrev: entity.localIdentifierValue ? nameOrAbbrev : '',
        customerLocalIdentifierValue: entity.localIdentifierValue ?? ''
    };
}

export function getUserProviderType(
    provider:
        | TEntities<
              TGetUserWithRelationsPayload['account']['individuals'][0] | null,
              TGetUserWithRelationsPayload['account']['organizations'][0] | null
          >
        | undefined
        | null
) {
    if (!provider) return undefined;

    return provider.individual
        ? EntitiesEnum.individual
        : provider.organization
          ? EntitiesEnum.organization
          : undefined;
}

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

type TNullToUndefined<T> = {
    [K in keyof T]: Exclude<T[K], null> extends never ? undefined : Exclude<T[K], null>;
};

export const deNullifyObject = <T extends Record<string, unknown>>(obj: T): TNullToUndefined<T> => {
    let denullifiedEntity = { ...obj } as TNullToUndefined<T>;

    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === null) {
                    // Leaf with null value will be turned to undefined
                    denullifiedEntity = { ...denullifiedEntity, [key]: undefined };
                } else if (Array.isArray(obj[key])) {
                    // Array leaf
                    const a = obj[key] as unknown[];
                    const transformedArrayElements = a.map((item: unknown) => {
                        if (item === null) {
                            return undefined;
                        } else if (typeof item === 'object') {
                            return deNullifyObject(item as T);
                        }
                        return item;
                    });
                    denullifiedEntity = { ...denullifiedEntity, [key]: transformedArrayElements };
                } else if (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
                    const subObj = obj[key] as T;
                    denullifiedEntity = { ...denullifiedEntity, [key]: deNullifyObject(subObj) };
                }
            }
        }
    }

    return denullifiedEntity;
};

export function getDirtyValues<T>(
    dirtyFields: T | TDirtyFields<T>,
    allValues: T
): Partial<T> | undefined {
    // If *any* item in an array was modified, the entire array must be submitted,
    // because there's no way to indicate "placeholders" for unchanged elements.
    // `dirtyFields` is `true` for leaves.
    if ((Array.isArray(dirtyFields) && Array.isArray(allValues)) || dirtyFields === true) {
        return allValues;
    }

    // Here, we have an object
    if (
        typeof dirtyFields === 'object' &&
        typeof allValues === 'object' &&
        dirtyFields !== null &&
        allValues !== null
    ) {
        const transformedFields = Object.keys(dirtyFields).reduce((acc, key) => {
            if (!(key in allValues)) {
                return acc;
            }
            const nestedDirtyFields = (dirtyFields as Record<string, unknown>)[key];
            const nestedAllValues = (allValues as Record<string, unknown>)[key];
            const result = getDirtyValues(nestedDirtyFields, nestedAllValues);
            if (result === undefined) {
                return acc;
            }
            return { ...acc, [key]: result };
        }, {});

        return Object.keys(transformedFields).length > 0 ? transformedFields : undefined;
    }
}

export function stringToBoolean(str: string | undefined): boolean | undefined {
    return str !== undefined ? str.toLowerCase() === 'true' : str;
}

export function isDayJsDate(val: unknown) {
    return dayjs.isDayjs(val) && '$d' in val && val.$d instanceof Date && dayjs(val.$d).isValid();
}

export function isValidDate(
    errorMessage: string
): z.ZodType<Date | dayjs.Dayjs, z.ZodTypeDef, Date | dayjs.Dayjs> {
    return z.custom<Date | Dayjs>(
        (val) => {
            return val instanceof Date || isDayJsDate(val);
        },
        { message: errorMessage }
    );
}

export const maskMax3Digits = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Masking the price to max 3 digits
    // by finding input values that contain more
    // than 3 digits and removing the last digit.
    const isMatch = value.match(/(\d{4,})/g);
    if (isMatch) {
        e.target.value = value.slice(0, -1);
    }
};

export const isNumeric = (str: string) => {
    if (typeof str !== 'string') return false;
    const possiblyNumber = Number(str);
    const possiblyFloat = parseFloat(str);
    return !isNaN(possiblyNumber) && !isNaN(possiblyFloat);
};

export const isNumericInput = (str: string) => {
    if (str === '') return true;
    if (str === '.') str = '0.';
    return isNumeric(str);
};

/**
 * Removes all non-numeric characters from the input.
 * Only digits and . are allowed.
 */
export const maskNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    e.target.value = value.trim();
    // Masking the value to be a number
    if (isNumericInput(value)) {
        return;
    }
    const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    let matchIndex = -1;
    for (let index = 0; index < value.length; index++) {
        if (!allowedChars.includes(value[index])) {
            matchIndex = index;
            break;
        }
    }

    if (matchIndex !== -1) {
        const valueArray = value.split('');
        valueArray.splice(matchIndex, 1);
        e.target.value = valueArray.join('');
        maskNumber(e);
    }
};

/**
 * The regular expression (\d{1,}(?=\D|$)) is used to match
 * the whole part of the decimal number. It ensures that the
 * whole part is followed by either a decimal point with 1 or 2
 * digits, or the end of the string.
 */
function matchAndReplaceLongWholePart(e: ChangeEvent<HTMLInputElement>, maxLength: number) {
    const { value } = e.target;
    const regex = new RegExp(`(\\d{${maxLength + 1},})(\\.\\d{1,2}|$)`);
    const match = value.match(regex);

    if (match) {
        const wholePart = match[1].slice(0, maxLength);
        const remainingPart = match[2]; // .00 or .3
        e.target.value = wholePart + remainingPart;
    }
}

export const mask2DecimalPlaces = (e: ChangeEvent<HTMLInputElement>) => {
    maskNumber(e);
    const { value } = e.target;
    // Masking the value to max 2 decimal places
    const match = value.match(/(\d+)\.(\d{3,})/);
    if (match) {
        e.target.value = match[1] + '.' + match[2].slice(0, 2);
    }
};

export const mask3DecimalPlaces = (e: ChangeEvent<HTMLInputElement>) => {
    maskNumber(e);
    const { value } = e.target;
    // Masking the value to max 3 decimal places
    const match = value.match(/(\d+)\.(\d{4,})/);
    if (match) {
        e.target.value = match[1] + '.' + match[2].slice(0, 3);
    }
};

export const maskPrice = (e: ChangeEvent<HTMLInputElement>) => {
    mask2DecimalPlaces(e);
    matchAndReplaceLongWholePart(e, 12);
};

export const maskPercentage = (e: ChangeEvent<HTMLInputElement>) => {
    maskNumber(e);
    const { value } = e.target;
    const numericValue = parseFloat(value);
    if (numericValue < 0) {
        e.target.value = '0';
    } else if (numericValue > 100) {
        e.target.value = '100';
    }
};

export const anyTrue = (
    obj: Record<string, unknown> | Record<string, unknown>[] | boolean[]
): boolean => {
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return false;
        }
        return obj.some((item) => {
            if (typeof item === 'boolean') {
                return item;
            } else {
                return anyTrue(item);
            }
        });
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value === true) {
                return true;
            } else if (typeof value === 'object' && value !== null) {
                if (anyTrue(value as Record<string, unknown>)) {
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * Deep compares two objects to determine if they are equal
 *
 * @param obj1 - The first object to compare
 * @param obj2 - The second object to compare
 * @returns true if the objects are equal, false otherwise
 */
// function deepCompareObjects(obj1: unknown, obj2: unknown): boolean {
//     // Check if the objects are the same type
//     if (typeof obj1 !== typeof obj2) {
//         return false;
//     }

//     // Check if the objects are arrays
//     if (Array.isArray(obj1) && Array.isArray(obj2)) {
//         if (obj1.length !== obj2.length) {
//             return false;
//         }
//         for (let i = 0; i < obj1.length; i++) {
//             if (!deepCompareObjects(obj1[i], obj2[i])) {
//                 return false;
//             }
//         }
//         return true;
//     }

//     // Check if the objects are objects
//     if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
//         const keys1 = Object.keys(obj1);
//         const keys2 = Object.keys(obj2);
//         if (keys1.length !== keys2.length) {
//             return false;
//         }
//         for (const key of keys1) {
//             if (
//                 !deepCompareObjects(
//                     (obj1 as Record<string, unknown>)[key] as unknown,
//                     (obj2 as Record<string, unknown>)[key]
//                 )
//             ) {
//                 return false;
//             }
//         }
//         return true;
//     }

//     // Compare primitive values
//     return obj1 === obj2;
// }

/**
 * If the values argument contains null, undefined or an empty string,
 * it will recursively populate it with the default value from
 * `defaultValues` argument.
 * Both argument must be objects of the same shape.
 */
export const populateForm = <R extends Record<string, unknown>>(
    defaultValues: R,
    values: Record<string, unknown>
): R => {
    const populateArray = (defaultValuesArray: unknown[], valuesArray: unknown[]): unknown[] => {
        return valuesArray.map((item, index) => {
            if (
                typeof item === 'object' &&
                item !== null &&
                typeof defaultValuesArray[index] === 'object' &&
                defaultValuesArray[index] !== null &&
                !Array.isArray(item) &&
                !Array.isArray(defaultValuesArray[index])
            ) {
                return populateForm<Record<string, unknown>>(
                    defaultValuesArray[index] as Record<string, unknown>,
                    item as Record<string, unknown>
                );
            } else if (Array.isArray(item) && Array.isArray(defaultValuesArray[index])) {
                return populateArray(defaultValuesArray[index] as unknown[], item as unknown[]);
            } else if (item === null || item === undefined || item === '') {
                // Small assumption that instead of null or undefined, it will be an empty string
                return defaultValuesArray[index] || '';
            } else {
                return item;
            }
        });
    };

    const keys = Object.keys(defaultValues);

    return keys.reduce<Record<string, unknown>>((acc, key) => {
        if (key in values) {
            // If OBJECT
            if (
                typeof values[key] === 'object' &&
                values[key] !== null &&
                typeof defaultValues[key] === 'object' &&
                defaultValues[key] !== null &&
                !Array.isArray(values[key]) &&
                !Array.isArray(defaultValues[key])
            ) {
                if (Object.keys(values[key] as Record<string, unknown>).length > 0) {
                    acc[key] = populateForm<Record<string, unknown>>(
                        defaultValues[key] as Record<string, unknown>,
                        values[key] as Record<string, unknown>
                    );
                } else {
                    acc[key] = defaultValues[key];
                }
                return acc;
            }

            // If ARRAY
            if (Array.isArray(values[key]) && Array.isArray(defaultValues[key])) {
                const defaultValuesArray = defaultValues[key] as unknown[];
                const valuesArray = values[key] as unknown[];
                acc[key] = !valuesArray.length
                    ? defaultValuesArray
                    : populateArray(defaultValuesArray, valuesArray);
                return acc;
            }

            // If EMPTY VALUE
            if (values[key] === null || values[key] === undefined || values[key] === '') {
                acc[key] = defaultValues[key];
            } else {
                // In all other cases
                acc[key] = values[key];
            }
            return acc;
        }
        acc[key] = defaultValues[key];
        return acc;
    }, {}) as R;
};

export const getUser = async () => {
    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);

    const userAccountProvider = provider && providerType && provider[providerType];

    const userState: IUserState = {
        user: dbUser,
        account: dbUser.account,
        profile: dbUser.profile,
        provider: userAccountProvider,
        providerType
    };

    return userState;
};

export const getLogoCreateOrUpdate = async (
    logo: TIndividualFormOutput['logo'] | undefined,
    userId: string,
    isUpdate = true
) => {
    const logoFile = logo?.data;
    const logoArrayBuffer = await logoFile?.arrayBuffer();

    const buffer = logoArrayBuffer && Buffer.from(logoArrayBuffer);
    let logoCreateOrUpdate: Prisma.fileUpdateOneWithoutProfileNestedInput | undefined = undefined;

    if (logo && buffer) {
        if ('id' in logo && logo.id) {
            logoCreateOrUpdate = {
                update: {
                    data: {
                        ...logo,
                        data: buffer,
                        updatedBy: userId
                    }
                }
            };
        } else {
            logoCreateOrUpdate = {
                create: {
                    ...logo,
                    data: buffer,
                    createdBy: userId,
                    updatedBy: userId
                }
            };
        }
    } else if (logo === null && isUpdate) {
        logoCreateOrUpdate = {
            delete: true
        };
    }

    return logoCreateOrUpdate;
};

const getEntityValidationSchema = <
    T extends TIndividualFormOutputWithoutLogo | TOrganizationFormOutputWithoutLogo
>(
    formData: T,
    logoFormData?: {
        [k: string]: FormDataEntryValue;
    } | null,
    isIndividual?: boolean
) => {
    const isEdit = 'id' in formData && formData.id;
    const isLogo = logoFormData?.id;

    return isIndividual
        ? isEdit
            ? isLogo
                ? getIndividualUpdateSchema
                : getIndividualUpdateSchemaEmptyLogo
            : getIndividualCreateSchema
        : isEdit
          ? isLogo
              ? getOrganizationUpdateSchema
              : getOrganizationUpdateSchemaEmptyLogo
          : getOrganizationCreateSchema;
};

export const validateEntityFormData = <
    T extends TIndividualFormOutputWithoutLogo | TOrganizationFormOutputWithoutLogo
>(
    t: TTranslateFn,
    formData: T,
    rawLogoFormData?: FormData,
    isIndividual?: boolean
): SafeParseReturnType<
    T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] },
    T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] }
> => {
    const logoFormData = rawLogoFormData ? Object.fromEntries(rawLogoFormData.entries()) : null;
    const formDataWithLogo = { ...formData, logo: logoFormData };

    const validationSchema = getEntityValidationSchema(formData, logoFormData, isIndividual);

    return validationSchema(t).safeParse(formDataWithLogo) as SafeParseReturnType<
        T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] },
        T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] }
    >;
};

export const stringifyObjectValues = (o: Record<string, string | number | boolean>) => {
    return Object.entries(o).reduce((acc, [key, value]) => {
        return { ...acc, [key]: value.toString() };
    }, {});
};

/**
 * Rounding to 2 decimal places
 */
const roundTo2DP = (number: number) => {
    return Math.round(number * 100) / 100;
};

/**
 * Getting invoice item subtotal in smaller units.
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 */
export const getInvoiceItemSubtotal = ({
    price,
    quantity
}: {
    price: number;
    quantity: number;
}) => {
    return (price * quantity) / 1000;
};

/**
 * Getting discount amount in smaller units.
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 *
 * The discountPercent is a whole number representing
 * the percentage multiplied by 100 in order to account
 * for the rounding errors when the discount has (maximum)
 * 2 decimal places.
 * Examples:
 * 100 = 1%
 * 1892 = 18.92%
 */
export const getInvoiceItemDiscountAmount = ({
    price,
    quantity,
    discountPercent
}: {
    price: number;
    quantity: number;
    discountPercent: number;
}) => {
    return roundTo2DP((getInvoiceItemSubtotal({ price, quantity }) * discountPercent) / 10000);
};

/**
 * Getting invoice item subtotal after discount in smaller units.
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 *
 * The discountPercent is a whole number representing
 * the percentage multiplied by 100 in order to account
 * for the rounding errors when the discount has (maximum)
 * 2 decimal places.
 * Examples:
 * 100 = 1%
 * 1892 = 18.92%
 */
export const getInvoiceItemSubtotalAfterDiscount = ({
    price,
    discountPercent,
    quantity
}: {
    price: number;
    discountPercent: number;
    quantity: number;
}) => {
    const invoiceItemSubtotal = getInvoiceItemSubtotal({ price, quantity });
    const invoiceItemDiscountAmount = getInvoiceItemDiscountAmount({
        price,
        discountPercent,
        quantity
    });

    return invoiceItemSubtotal - invoiceItemDiscountAmount;
};

/**
 * Getting invoice item tax amount in smaller units
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 *
 * The taxPercent is a whole number representing
 * the percentage multiplied by 1000 in order to account
 * for the rounding errors when the sales tax has (maximum)
 * 3 decimal places.
 * Examples:
 * 1000 = 1%
 * 18925 = 18.925%
 *
 * The discountPercent is a whole number representing
 * the percentage multiplied by 100 in order to account
 * for the rounding errors when the discount has (maximum)
 * 2 decimal places.
 * Examples:
 * 100 = 1%
 * 1892 = 18.92%
 */
export const getInvoiceItemSalesTaxAmount = ({
    price,
    discountPercent,
    taxPercent,
    quantity
}: {
    price: number;
    discountPercent: number;
    taxPercent: number;
    quantity: number;
}) => {
    const invoiceItemSubtotalBeforeTax = getInvoiceItemSubtotalAfterDiscount({
        price,
        discountPercent,
        quantity
    });
    return (invoiceItemSubtotalBeforeTax / 100000) * taxPercent;
};

/**
 * Getting invoice item subtotal after tax in smaller units.
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 *
 * The discountPercent is a whole number representing
 * the percentage multiplied by 100 in order to account
 * for the rounding errors when the discount has (maximum)
 * 2 decimal places.
 * Examples:
 * 100 = 1%
 * 1892 = 18.92%
 *
 * The taxPercent is a whole number representing
 * the percentage multiplied by 1000 in order to account
 * for the rounding errors when the sales tax has (maximum)
 * 3 decimal places.
 * Examples:
 * 1000 = 1%
 * 18925 = 18.925%
 */
export const getInvoiceItemSubtotalAfterTax = ({
    price,
    discountPercent,
    taxPercent,
    quantity
}: {
    price: number;
    discountPercent: number;
    taxPercent: number;
    quantity: number;
}) => {
    const subtotalAfterDiscount = getInvoiceItemSubtotalAfterDiscount({
        price,
        discountPercent,
        quantity
    });
    const taxAmount = getInvoiceItemSalesTaxAmount({
        price,
        discountPercent,
        taxPercent,
        quantity
    });
    return subtotalAfterDiscount + taxAmount;
};

/**
 * Getting invoice total in smaller units.
 *
 * For correct calculations the below formula constituents must
 * have following format:
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 *
 * The discountPercent is a whole number representing
 * the percentage multiplied by 100 in order to account
 * for the rounding errors when the discount has (maximum)
 * 2 decimal places.
 * Examples:
 * 100 = 1%
 * 1892 = 18.92%
 *
 * The taxPercent is a whole number representing
 * the percentage multiplied by 1000 in order to account
 * for the rounding errors when the sales tax has (maximum)
 * 3 decimal places.
 * Examples:
 * 1000 = 1%
 * 18925 = 18.925%
 */
export const getInvoiceTotal = (
    invoiceItems: Pick<
        TTransformedInvoice['invoiceItems'][number],
        'price' | 'quantity' | 'discount' | 'salesTax'
    >[]
) => {
    return invoiceItems.reduce((acc, ii) => {
        const { price, quantity } = ii;
        const discountPercent = ii.discount;
        const taxPercent = ii.salesTax;
        return (
            acc +
            getInvoiceItemSubtotalAfterTax({
                price,
                discountPercent,
                taxPercent,
                quantity
            })
        );
    }, 0);
};

/**
 * Getting invoice total tax and discount in smaller units.
 *
 * Used to show total tax and discount on invoices
 * for informational purposes.
 *
 * For correct calculations the below formula constituents must
 * have following format:
 *
 * The price is a whole number in smaller units representing the decimal
 * price value multiplied by 100 .
 * Examples (assuming $):
 * 1000 = $10.00
 * 18925 = $189.25
 *
 * The quantity is a whole number representing pieces, pounds, milligrams,
 * etc. multiplied by 1000 in order to account for the rounding errors
 * when the quantity has (maximum) 3 decimal places.
 * Examples:
 * 1 = 0.001 milligram
 * 1000 = 1 piece
 * 10892 = 10.892 kilograms
 *
 * The discountPercent is a whole number representing
 * the percentage multiplied by 100 in order to account
 * for the rounding errors when the discount has (maximum)
 * 2 decimal places.
 * Examples:
 * 100 = 1%
 * 1892 = 18.92%
 *
 * The taxPercent is a whole number representing
 * the percentage multiplied by 1000 in order to account
 * for the rounding errors when the sales tax has (maximum)
 * 3 decimal places.
 * Examples:
 * 1000 = 1%
 * 18925 = 18.925%
 */
export const getInvoiceSubtotalTaxAndDiscount = (
    invoiceItems: Pick<
        TTransformedInvoice['invoiceItems'][number],
        'price' | 'quantity' | 'discount' | 'salesTax'
    >[]
) => {
    return invoiceItems.reduce(
        (acc, ii) => {
            const { price, quantity } = ii;
            const discountPercent = ii.discount;
            const taxPercent = ii.salesTax;
            return {
                subtotal:
                    acc.subtotal +
                    getInvoiceItemSubtotal({
                        price,
                        quantity
                    }),
                taxTotal:
                    acc.taxTotal +
                    getInvoiceItemSalesTaxAmount({
                        price,
                        discountPercent,
                        taxPercent,
                        quantity
                    }),
                discountTotal:
                    acc.discountTotal +
                    getInvoiceItemDiscountAmount({
                        price,
                        discountPercent,
                        quantity
                    })
            };
        },
        {
            subtotal: 0,
            taxTotal: 0,
            discountTotal: 0
        }
    );
};
