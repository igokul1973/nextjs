import { LocaleEnum, ORDER } from '@/app/lib/types';
import { stringToBoolean } from '@/app/lib/utils';
import { z } from 'zod';

export const DEFAULT_ITEMS_PER_PAGE = 5;
export const DEFAULT_PAGE_NUMBER = 0;
export const DEFAULT_ORDER = 'asc';
export const DEFAULT_ORDER_BY = 'name';
export const DEFAULT_IS_DENSE = true;

const locales = Object.values(LocaleEnum) as [LocaleEnum, ...LocaleEnum[]];

export const propsSchemaWithoutParams = z.object({
    searchParams: z.object({
        query: z.string().optional(),
        page: z.coerce.number().optional(),
        itemsPerPage: z.coerce.number().optional(),
        order: z.enum(ORDER).optional(),
        isDense: z.string().optional().transform<boolean | undefined>(stringToBoolean),
        orderBy: z.string().optional(),
        showOrg: z.string().optional().transform<boolean | undefined>(stringToBoolean),
        showInd: z.string().optional().transform<boolean | undefined>(stringToBoolean)
    })
});

export const propsSchema = propsSchemaWithoutParams.extend({
    params: z.object({
        locale: z.enum<LocaleEnum, [LocaleEnum, ...LocaleEnum[]]>(locales)
    })
});
