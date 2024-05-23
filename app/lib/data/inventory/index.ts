import { DEFAULT_ITEMS_PER_PAGE } from '@/app/[locale]/dashboard/inventory/constants';
import prisma from '@/app/lib/prisma';
import { IBaseDataFilterArgs } from '@/app/lib/types';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import {
    TGetInventoryPayload,
    TInventoryTransformed,
    getInventorySelect,
    getQueryFilterWhereClause
} from './types';

export async function getInventoryItemById(
    id: string,
    accountId: string,
    isSuperAdmin = false
): Promise<TGetInventoryPayload | null> {
    noStore();
    try {
        const inventoryItem = await prisma.inventory.findFirst({
            relationLoadStrategy: 'query',
            select: getInventorySelect,
            where: {
                id,
                accountId: !isSuperAdmin ? { equals: accountId } : undefined
            }
        });

        if (!inventoryItem) {
            return null;
        }

        const { price, manufacturerPrice, ...inventory } = inventoryItem;

        return {
            ...inventory,
            price: Number(price),
            manufacturerPrice: manufacturerPrice === null ? null : Number(manufacturerPrice)
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get inventoryItem.');
    }
}

export async function getFilteredInventoryByAccountIdRaw({
    accountId,
    query,
    page = 0,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    orderBy = 'name',
    order = 'asc'
}: IBaseDataFilterArgs): Promise<TInventoryTransformed[]> {
    noStore();

    const offset = page * itemsPerPage;

    const numericQuery = Number(query);
    const isQueryNumber = !isNaN(numericQuery);
    const queryFilterWhereClause = getQueryFilterWhereClause(query);

    if (isQueryNumber) {
        queryFilterWhereClause.OR?.push({
            manufacturerPrice: {
                equals: numericQuery
            }
        });
    }

    const orderByClause:
        | Prisma.inventoryOrderByWithRelationInput
        | Prisma.inventoryOrderByWithRelationInput[] =
        orderBy === 'type' ? { type: { type: order } } : { [orderBy]: order };

    const res = await prisma.inventory.findMany({
        relationLoadStrategy: 'join',
        take: itemsPerPage,
        skip: offset,
        orderBy: orderByClause,
        include: {
            type: true
        },
        where: {
            AND: [
                {
                    accountId: {
                        equals: accountId
                    }
                },
                queryFilterWhereClause
            ]
        }
    });

    return res.map(({ price, manufacturerPrice, ...inventoryItem }) => {
        return {
            ...inventoryItem,
            price: Number(price),
            manufacturerPrice: manufacturerPrice === null ? null : Number(manufacturerPrice)
        };
    });
}

export async function getFilteredInventoryCount(accountId: string, query: string) {
    noStore();

    const numericQuery = Number(query);
    const isQueryNumber = !isNaN(numericQuery);
    const queryFilterWhereClause = getQueryFilterWhereClause(query);

    if (isQueryNumber) {
        queryFilterWhereClause.OR?.push({
            manufacturerPrice: {
                equals: numericQuery
            }
        });
    }

    try {
        const count = await prisma.inventory.count({
            where: {
                AND: [
                    {
                        accountId: {
                            equals: accountId
                        }
                    },
                    queryFilterWhereClause
                ]
            }
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get total number of inventory.');
    }
}
