'use server';

import { DEFAULT_ITEMS_PER_PAGE } from '@/app/[locale]/dashboard/inventory/constants';
import { TInventoryFormOutput } from '@/app/components/inventory/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TOrder } from '@/app/lib/types';
import { getDirtyValues } from '@/app/lib/utils';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
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

export async function getFilteredInventoryByAccountIdRaw(
    accountId: string,
    query: string,
    currentPage: number = 0,
    itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE,
    orderBy: string = 'name',
    order: TOrder = 'asc'
): Promise<TInventoryTransformed[]> {
    noStore();

    const offset = currentPage * itemsPerPage;

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

export async function createInventoryItem(formData: TInventoryFormOutput) {
    try {
        const newInventoryItem = await prisma.inventory.create({
            data: formData
        });

        console.log('Successfully created new inventory item: ', newInventoryItem);
        revalidatePath('/dashboard/inventory');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to create inventory item');
    }
}

export async function updateInventoryItem(
    formData: TInventoryFormOutput,
    dirtyFields: TDirtyFields<TInventoryFormOutput>,
    userId: string
) {
    const changedFields = getDirtyValues<TInventoryFormOutput>(dirtyFields, formData);

    if (!changedFields) {
        return null;
    }

    const data = { ...changedFields, updatedBy: userId };

    try {
        await prisma.inventory.update({
            where: {
                id: formData.id
            },
            data
        });

        console.log('Successfully updated inventory item with ID:', formData.id);
        revalidatePath('/dashboard/inventory');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to update inventory item');
    }
}

export async function deleteInventoryItemById(id: string) {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    try {
        await prisma.inventory.delete({
            where: {
                id
            }
        });

        console.log(`Successfully deleted inventory with ID #${id}`);

        revalidatePath('/dashboard/inventory');
    } catch (error: unknown) {
        console.error('Database Error:', error);
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.message.toLocaleLowerCase().includes('foreign key constraint') &&
            error.message.toLocaleLowerCase().includes('invoice')
        ) {
            throw new Error('cannot delete inventory item because it has associated invoices');
        }
        throw new Error('database error: failed to delete inventory item');
    }
}
