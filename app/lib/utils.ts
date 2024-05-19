import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { auth } from '@/auth';
import { EntitiesEnum, Prisma } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { redirect } from 'next/navigation';
import { ChangeEvent } from 'react';
import { SafeParseReturnType, z } from 'zod';
import { TSingleTranslationKey } from '../../locales/types';
import {
    individualUpdateSchema,
    individualUpdateSchemaEmptyLogo
} from '../components/individuals/form/formSchema.ts';
import {
    TIndividualFormOutput,
    TIndividualFormOutputWithoutLogo
} from '../components/individuals/form/types.ts';
import { TCustomerOutput } from '../components/invoices/form/types';
import {
    organizationUpdateSchema,
    organizationUpdateSchemaEmptyLogo
} from '../components/organizations/form/formSchema.ts';
import {
    TOrganizationFormOutput,
    TOrganizationFormOutputWithoutLogo
} from '../components/organizations/form/types.ts';
import { IUserState } from '../context/user/types';
import { getIndividualFullNameString, getUserProvider } from './commonUtils.ts';
import { TCustomerPayload, TCustomerWithInvoicesPayload } from './data/customer/types';
import { TGetUserWithRelationsPayload } from './data/user/types';
import { TDirtyFields, TEntities, TIndividual } from './types';

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

export const objectKeys = Object.keys as unknown as <T>(o: T) => (keyof T)[];

export const formatCurrency = (amount: number, locale: string) => {
    const currrencyCode = localeToCurrencyCode[locale];
    return (amount / 100).toLocaleString(locale, {
        style: 'currency',
        currency: currrencyCode
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

export function flattenCustomer(
    rawCustomer: TCustomerPayload | TCustomerWithInvoicesPayload
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

export function stringToBoolean(str: string) {
    // Ternary operator: condition ? true-value : false-value
    return str.toLowerCase() === 'true' ? true : false;
}

export function isDayJsDate(val: unknown) {
    return dayjs.isDayjs(val) && '$d' in val && val.$d instanceof Date && dayjs(val.$d).isValid();
}

export function isValidDate(
    errorMessage: TSingleTranslationKey
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
    changedFields: Partial<TIndividualFormOutput | TOrganizationFormOutput>,
    userId: string
) => {
    const logoFile = changedFields.logo?.data;
    const logoArrayBuffer = await logoFile?.arrayBuffer();

    const buffer = logoArrayBuffer && Buffer.from(logoArrayBuffer);
    let logoCreateOrUpdate: Prisma.fileUpdateOneWithoutProfileNestedInput | undefined = undefined;

    if (changedFields.logo && buffer) {
        if ('id' in changedFields.logo && changedFields.logo.id) {
            logoCreateOrUpdate = {
                update: {
                    data: {
                        ...changedFields.logo,
                        data: buffer,
                        updatedBy: userId
                    }
                }
            };
        } else {
            logoCreateOrUpdate = {
                create: {
                    ...changedFields.logo,
                    data: buffer,
                    createdBy: userId,
                    updatedBy: userId
                }
            };
        }
    } else if (changedFields.logo === null) {
        logoCreateOrUpdate = {
            delete: true
        };
    }

    return logoCreateOrUpdate;
};

export const validateEntityFormData = <
    T extends TIndividualFormOutputWithoutLogo | TOrganizationFormOutputWithoutLogo
>(
    formData: T,
    rawLogoFormData?: FormData,
    isIndividual?: boolean
): SafeParseReturnType<
    T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] },
    T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] }
> => {
    const logoFormData = rawLogoFormData ? Object.fromEntries(rawLogoFormData.entries()) : null;
    let preValidatedFormData = { ...formData, logo: logoFormData };

    const validationSchema = isIndividual
        ? logoFormData?.id
            ? individualUpdateSchema
            : individualUpdateSchemaEmptyLogo
        : logoFormData?.id
          ? organizationUpdateSchema
          : organizationUpdateSchemaEmptyLogo;

    return validationSchema.safeParse(preValidatedFormData) as SafeParseReturnType<
        T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] },
        T & { logo: TIndividualFormOutput['logo'] | TOrganizationFormOutput['logo'] }
    >;
};
