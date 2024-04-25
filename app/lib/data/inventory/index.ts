'use server';

import { TInventoryForm } from '@/app/components/inventory/create-form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TOrder } from '@/app/lib/types';
import { formatCurrency, getDirtyValues } from '@/app/lib/utils';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { TGetInventoryPayload, getInventorySelect, getQueryFilterWhereClause } from './types';

export async function getInventoryItemById(id: string): Promise<TGetInventoryPayload | null> {
    noStore();
    try {
        const inventoryItem = await prisma.inventory.findFirst({
            relationLoadStrategy: 'query',
            select: getInventorySelect,
            where: {
                id
            }
        });

        if (!inventoryItem) {
            throw new Error('Inventory item not found');
        }

        const { price, manufacturerPrice, ...inventory } = inventoryItem;

        return {
            ...inventory,
            price: price / 100,
            manufacturerPrice: manufacturerPrice && manufacturerPrice / 100
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get inventoryItem.');
    }
}

export async function getFilteredInventoryByAccountId(
    accountId: string,
    query: string,
    currentPage: number,
    itemsPerPage: number,
    orderBy: string = 'name',
    order: TOrder = 'asc'
) {
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

    try {
        const inventory = await prisma.inventory.findMany({
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

        return inventory.map((inventoryItem) => {
            return {
                ...inventoryItem,
                price: formatCurrency(inventoryItem.price),
                manufacturerPrice: inventoryItem.manufacturerPrice
                    ? formatCurrency(inventoryItem.manufacturerPrice)
                    : ''
            };
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get inventory.');
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
        throw new Error('Failed to get total number of inventory.');
    }
}

export async function createInventoryItem(formData: TInventoryForm) {
    try {
        const newInventoryItem = await prisma.inventory.create({
            data: formData
        });

        console.log('Successfully created new inventory item: ', newInventoryItem);

        revalidatePath('/dashboard/inventory');
        return newInventoryItem;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

export async function updateInventoryItem(
    formData: TInventoryForm,
    dirtyFields: TDirtyFields<TInventoryForm>,
    userId: string
) {
    const changedFields = getDirtyValues<TInventoryForm>(dirtyFields, formData);
    const data = { ...changedFields, updatedBy: userId };

    try {
        const updatedInventoryItem = await prisma.inventory.update({
            where: {
                id: formData.id
            },
            data
        });

        console.log('Successfully updated customer with ID:', updatedInventoryItem.id);

        revalidatePath('/dashboard/inventory');
        return updatedInventoryItem;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete inventoryItem.');
    }
}

export async function deleteInventoryItemById(id: string) {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Creating customer in DB
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
            throw new Error('Cannot delete inventory item because it has associated invoices.');
        }
        throw new Error('Database Error: failed to delete inventory item.');
    }
}
