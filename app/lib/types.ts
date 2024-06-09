// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

export enum LocaleEnum {
    en_US = 'en-US',
    en_GB = 'en-GB',
    es_ES = 'es-ES',
    fa_IR = 'fa-IR',
    fr_FR = 'fr-FR',
    he_IL = 'he-IL',
    hi_IN = 'hi-IN',
    id_ID = 'id-ID',
    it_IT = 'it-IT',
    ja_JP = 'ja-JP',
    ko_KR = 'ko-KR',
    mr_IN = 'mr-IN',
    nl_NL = 'nl-NL',
    no_NO = 'no-NO',
    pa_PK = 'pa-PK',
    pl_PL = 'pl-PL',
    pt_PT = 'pt-PT',
    ru_RU = 'ru-RU',
    sv_SE = 'sv-SE',
    sv_FI = 'sv-FI',
    sv_AX = 'sv-AX',
    ta_IN = 'ta-IN',
    te_IN = 'te-IN',
    th_TH = 'th-TH',
    tr_TR = 'tr-TR',
    ur_PK = 'ur-PK',
    zh_CN = 'zh-CN',
    zh_TW = 'zh-TW',
    da_DK = 'da-DK',
    ms_MY = 'ms-MY',
    sw_KE = 'sw-KE'
}

export const ORDER = ['asc', 'desc'] as const;
export type TOrder = (typeof ORDER)[number];

export type TDirtyFields<T> = {
    [K in keyof T]?: T[K] extends Record<string, unknown>
        ? TDirtyFields<T[K]> | boolean
        : T[K] extends Array<Record<string, unknown>>
          ? TDirtyFields<T[K][number]>[]
          : T[K] extends Array<string> | undefined
            ? boolean[] | undefined
            : boolean | undefined | TDirtyFields<T>;
};

import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import type {
    account as TAccount,
    address as TAddress,
    country as TCountry,
    customer as TCustomer,
    file as TFile,
    individual as TIndividual,
    individualEmail as TIndividualEmail,
    individualPhone as TIndividualPhone,
    inventory as TInventory,
    inventoryType as TInventoryType,
    invoice as TInvoice,
    invoiceItem as TInvoiceItem,
    localIdentifierName as TLocalIdentifierName,
    measurementUnit as TMeasurementUnit,
    organization as TOrganization,
    organizationEmail as TOrganizationEmail,
    organizationPhone as TOrganizationPhone,
    organizationType as TOrganizationType,
    profile as TProfile,
    user as TUser
} from '@prisma/client';
import { TCustomerPayload } from './data/customer/types';

export {
    TAccount,
    TAddress,
    TCountry,
    TCustomer,
    TFile,
    TIndividual,
    TIndividualEmail,
    TIndividualPhone,
    TInventory,
    TInventoryType,
    TInvoice,
    TInvoiceItem,
    TLocalIdentifierName,
    TMeasurementUnit,
    TOrganization,
    TOrganizationEmail,
    TOrganizationPhone,
    TOrganizationType,
    TProfile,
    TUser
};

export type TMuiIcon = OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
};

type Combine<A, B> = Partial<Omit<NonNullable<A>, keyof NonNullable<B>>> &
    Partial<Omit<NonNullable<B>, keyof NonNullable<A>>> & {
        [K in keyof NonNullable<A> & keyof NonNullable<B>]:
            | NonNullable<A>[K]
            | NonNullable<B>[K] extends Record<string, unknown>
            ? Combine<NonNullable<A>[K], NonNullable<B>[K]>
            : NonNullable<A>[K] | NonNullable<B>[K];
    };

export type TEntity = Combine<TCustomerPayload['organization'], TCustomerPayload['individual']>;

export type TEntities<I, O> = {
    individual?: I;
    organization?: O;
};

export type TEntityWithNonNullableCustomer = Combine<
    TIndWithNonNullableCustomer,
    TOrgWithNonNullableCustomer
>;

export type TIndWithNonNullableCustomer = Omit<
    Exclude<TCustomerPayload['individual'], null>,
    'customer'
> & {
    customer: TCustomer;
};

export type TOrgWithNonNullableCustomer = Omit<
    Exclude<TCustomerPayload['organization'], null>,
    'customer'
> & {
    customer: TCustomer;
};

export type TEntitiesWithNonNullableCustomer = {
    indCustomers: TIndWithNonNullableCustomer[];
    orgCustomers: TOrgWithNonNullableCustomer[];
};

export interface ISearchParams {
    query?: string;
    page?: string;
    itemsPerPage?: string;
    orderBy?: string;
    order?: TOrder;
    isDense?: string;
}

export interface ITypedSearchParams extends Record<string, string | number | boolean> {
    query: string;
    page: number;
    itemsPerPage: number;
    orderBy: string;
    order: TOrder;
    isDense: boolean;
}

export interface IBaseDataFilterArgs {
    accountId: string;
    query: string;
    page?: number;
    itemsPerPage?: number;
    orderBy?: string;
    order?: TOrder;
}
