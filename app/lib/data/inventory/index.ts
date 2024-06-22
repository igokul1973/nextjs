import prisma from '@/app/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import { TGetInventoryPayload, getInventorySelect, getQueryFilterWhereClause } from './types';

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
        throw new Error('could not get inventoryItem.');
    }
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
        throw new Error('could not get total number of inventory.');
    }
}
