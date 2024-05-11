import { TInventory, TInventoryType } from '@/app/lib/types';
import { Prisma } from '@prisma/client';

export const getInventorySelect = {
    id: true,
    name: true,
    typeId: true,
    accountId: true,
    price: true,
    description: true,
    externalCode: true,
    internalCode: true,
    manufacturerCode: true,
    manufacturerPrice: true,
    createdBy: true,
    updatedBy: true
} satisfies Prisma.inventorySelect;

export type TGetInventoryPayloadRaw = Prisma.inventoryGetPayload<{
    select: typeof getInventorySelect;
}>;

export type TGetInventoryPayload = Omit<TGetInventoryPayloadRaw, 'price' | 'manufacturerPrice'> & {
    price: number;
    manufacturerPrice: number | null;
};

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
                contains: query,
                mode: 'insensitive'
            }
        },
        {
            description: {
                contains: query,
                mode: 'insensitive'
            }
        },
        {
            externalCode: {
                contains: query,
                mode: 'insensitive'
            }
        },
        {
            internalCode: {
                contains: query,
                mode: 'insensitive'
            }
        },
        {
            manufacturerCode: {
                contains: query,
                mode: 'insensitive'
            }
        },
        {
            type: {
                is: {
                    type: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            }
        }
    ]
});

export type TInventoryTransformed = Omit<TInventory, 'price' | 'manufacturerPrice'> & {
    price: number;
    manufacturerPrice: number | null;
    type: TInventoryType;
};
