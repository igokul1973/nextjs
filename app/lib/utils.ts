import { AccountRelationEnum, EntitiesEnum } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent } from 'react';
import { z } from 'zod';
import { TSingleTranslationKeys } from '../../locales/types';
import { TCustomerOutput } from '../components/invoices/form/types';
import { TGetCustomerPayload, TGetCustomerWithInvoicesPayload } from './data/customer/types';
import {
    TGetUserWithRelationsAndInventoryPayload,
    TGetUserWithRelationsPayload
} from './data/user/types';
import {
    TDirtyFields,
    TEntities,
    TEntitiesWithNonNullableCustomer,
    TEntity,
    TIndWithNonNullableCustomer,
    TIndividual,
    TOrgWithNonNullableCustomer
} from './types';

export const objectKeys = Object.keys as unknown as <T>(o: T) => (keyof T)[];

export const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
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

export function useDebounce<T>(f: (...args: T[]) => unknown, ms: number = 500) {
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

export function getIndividualFullNameString(
    individual: Pick<TIndividual, 'firstName' | 'middleName' | 'lastName'>
): string {
    return `${individual.firstName}${individual.middleName ? ' ' + individual.middleName : ''} ${individual.lastName}`;
}

export function getProviderName(
    provider?: TGetCustomerPayload['individual'] | TGetCustomerPayload['organization']
): string {
    if (!provider) {
        return 'No provider name';
    }
    if ('name' in provider) {
        return provider.name;
    } else if ('firstName' in provider) {
        return getIndividualFullNameString(provider);
    }
    return 'No provider name';
}

export function flattenCustomer(
    rawCustomer: TGetCustomerPayload | TGetCustomerWithInvoicesPayload
): TCustomerOutput {
    const entity = rawCustomer.individual || rawCustomer.organization;
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
    if (!customerAddress) {
        throw Error('Something is not right with the customer address.');
    }

    return {
        customerId: rawCustomer.id,
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
        customerEmail: entity.emails.length ? entity.emails[0].email : 'no email provided'
    };
}

/**
 * Generates the user provider based on the input user payload.
 *
 * NOTE: Returning undefined if no provider is found.
 * Should work fornew users who cannot
 * have a provider until they add one.
 *
 * @param {TGetUserWithRelationsPayload | TUserWithRelations} user - The user payload or user with relations object.
 * @return {TEntities<I, O> | undefined} The individual or organization provider entity, or undefined if no provider is found.
 */
export function getUserProvider<
    I = TGetUserWithRelationsPayload['account']['individuals'][number],
    O = TGetUserWithRelationsPayload['account']['organizations'][number]
>(user: TGetUserWithRelationsPayload): TEntities<I, O> | undefined {
    const individualProvider = user.account.individuals?.find(
        (ind) => ind.accountRelation === AccountRelationEnum.provider
    );
    if (individualProvider) {
        return { individual: individualProvider } as TEntities<I, O>;
    }
    const organizationProvider = user.account.organizations?.find(
        (org) => org.accountRelation === AccountRelationEnum.provider
    );
    return organizationProvider
        ? ({ organization: organizationProvider } as TEntities<I, O>)
        : undefined;
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

const isIndHasCustomer = (
    o: TGetCustomerPayload['individual']
): o is TIndWithNonNullableCustomer => {
    return !!o?.customer;
};

const isOrgHasCustomer = (
    o: TGetCustomerPayload['organization']
): o is TOrgWithNonNullableCustomer => {
    return !!o?.customer;
};

/**
 * Generate a list of individual and organization customers associated
 * with a user's account and return them as an object with corresponding
 * lists.
 *
 * @param {TUserWithRelations} user - The user object with relations.
 * @return {TEntitiesWithNonNullableCustomer} An object containing lists of individual and organization customers.
 */
export function getUserCustomersPerEntity(
    user: TGetUserWithRelationsAndInventoryPayload
): TEntitiesWithNonNullableCustomer {
    const indCustomers = user.account.individuals.filter(isIndHasCustomer);
    const orgCustomers = user.account.organizations.filter(isOrgHasCustomer);

    return { indCustomers, orgCustomers };
}

export const getEntityName = (entity: TEntity) => {
    let name = entity.name;
    if (!name && entity.firstName && entity.lastName) {
        const individual = entity as TIndividual;
        name = getIndividualFullNameString(individual);
    }
    return name;
};

export const getEntityFirstEmailString = (entity: TEntity) => {
    const email = entity?.emails[0].email;
    if (!email) {
        throw Error('The provider does not have associated email. Please seed one first.');
    }
    return email;
};

export const getEntityFirstPhoneString = (entity: TEntity) => {
    const countryCode = entity?.phones[0].countryCode;
    if (!countryCode) {
        throw Error('The provider does not have associated country code. Please seed one first.');
    }
    const phoneNumber = entity?.phones[0].number;
    if (!phoneNumber) {
        throw Error('The provider does not have associated phone number. Please seed one first.');
    }
    return `+${countryCode}-${phoneNumber}`;
};

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
        // const transformedFields = Object.keys(dirtyFields).map((key) => {
        //     if (!(key in allValues)) {
        //         return [key, undefined];
        //     }
        //     const nestedDirtyFields = (dirtyFields as Record<string, unknown>)[key];
        //     const nestedAllValues = (allValues as Record<string, unknown>)[key];
        //     const result = getDirtyValues(nestedDirtyFields, nestedAllValues);
        //     return [key, result];
        // });
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

        // return Object.fromEntries(transformedFields);
        return Object.keys(transformedFields).length > 0 ? transformedFields : undefined;
    }
}

export function stringToBoolean(str: string) {
    // Ternary operator: condition ? true-value : false-value
    return str.toLowerCase() === 'true' ? true : false;
}

export function isDayJsDate(val: unknown) {
    return dayjs.isDayjs(val) && '$d' in val && val.$d instanceof Date && dayjs(val.$d).isValid();
}

export function isValidDate(
    errorMessage: TSingleTranslationKeys
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
    const { value } = e.target;
    // Masking the value to max 2 decimal places
    const isMatch = value.match(/(\d+\.\d{3,})/g);
    if (isMatch) {
        e.target.value = value.slice(0, -1);
    }
};

export const maskPrice = (e: ChangeEvent<HTMLInputElement>) => {
    mask2DecimalPlaces(e);
    matchAndReplaceLongWholePart(e, 12);
};

export const maskPercentage = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || value === '') {
        return (e.target.value = '0');
    } else if (numericValue > 100) {
        return (e.target.value = '100.00');
    } else if (numericValue < 0) {
        return (e.target.value = '0.00');
    }
    // Masking the price to max 2 decimal places
    mask2DecimalPlaces(e);
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
function deepCompareObjects(obj1: unknown, obj2: unknown): boolean {
    // Check if the objects are the same type
    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    // Check if the objects are arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!deepCompareObjects(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }

    // Check if the objects are objects
    if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            if (
                !deepCompareObjects(
                    (obj1 as Record<string, unknown>)[key] as unknown,
                    (obj2 as Record<string, unknown>)[key]
                )
            ) {
                return false;
            }
        }
        return true;
    }

    // Compare primitive values
    return obj1 === obj2;
}

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
