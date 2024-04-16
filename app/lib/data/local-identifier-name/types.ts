import { Prisma } from '@prisma/client';

export const getLocalIdentifierNamesSelect = {
    id: true,
    name: true,
    abbreviation: true,
    type: true
} satisfies Prisma.localIdentifierNameSelect;

export type TGetLocalIdentifierNamePayload = Prisma.localIdentifierNameGetPayload<{
    select: typeof getLocalIdentifierNamesSelect;
}>;

export interface ICreateLocalIdentifierNameState {
    message?: string | null;
    errors?: {
        name?: string[];
    };
}

export const getQueryFilterWhereClause = (query: string): Prisma.localIdentifierNameWhereInput => ({
    name: {
        contains: query
    }
});
