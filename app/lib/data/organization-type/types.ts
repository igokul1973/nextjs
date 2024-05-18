import { Prisma } from '@prisma/client';

export const getOrganizationTypesSelect = {
    id: true,
    type: true
} satisfies Prisma.organizationTypeSelect;

export type TGetOrganizationTypePayload = Prisma.organizationTypeGetPayload<{
    select: typeof getOrganizationTypesSelect;
}>;

export interface ICreateOrganizationTypeState {
    message?: string | null;
    errors?: {
        name?: string[];
    };
}

export const getQueryFilterWhereClause = (query: string): Prisma.organizationTypeWhereInput => ({
    type: {
        contains: query
    }
});
