import { Prisma } from '@prisma/client';

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
