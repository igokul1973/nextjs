import { Prisma } from '@prisma/client';

export const getCountriesSelect = {
    id: true,
    name: true
} satisfies Prisma.countrySelect;

export type TGetCountryPayload = Prisma.countryGetPayload<{
    select: typeof getCountriesSelect;
}>;

export interface ICreateCountryState {
    message?: string | null;
    errors?: {
        name?: string[];
    };
}

export const getQueryFilterWhereClause = (query: string): Prisma.countryWhereInput => ({
    name: {
        contains: query
    }
});
