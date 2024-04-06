import { Prisma } from '@prisma/client';

export const getInventorySelect = {
    id: true,
    name: true
} satisfies Prisma.inventorySelect;

export type TGetInventoryPayload = Prisma.inventoryGetPayload<{
    select: typeof getInventorySelect;
}>;

export interface ICreateInventoryItemState {
    message?: string | null;
    errors?: {
        name?: string[];
        description?: string[];
        price?: string[];
        externalCode: string[];
        internalCode: string[];
        manufacturerCode: string[];
        manufacturerPrice: string[];
    };
}

export const getQueryFilterWhereClause = (query: string): Prisma.inventoryWhereInput => ({
    OR: [
        {
            name: {
                contains: query
            }
        },
        {
            description: {
                contains: query
            }
        },
        {
            externalCode: {
                contains: query
            }
        },
        {
            internalCode: {
                contains: query
            }
        },
        {
            manufacturerCode: {
                contains: query
            }
        }
    ]
});
