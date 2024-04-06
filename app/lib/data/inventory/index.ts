'use server';

import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
    ICreateInventoryItemState,
    TGetInventoryPayload,
    getInventorySelect,
    getQueryFilterWhereClause
} from './types';

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    id: z.string(),
    name: z.string()
});

const UpdateInventoryItem = FormSchema.omit({ id: true });
const CreateInventoryItem = FormSchema.omit({ id: true });

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

        return inventoryItem;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get inventoryItem.');
    }
}

export async function getFilteredInventoryByAccountId(accountId: string, query: string) {
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
        const inventory = await prisma.inventory.findMany({
            relationLoadStrategy: 'join',
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                externalCode: true,
                internalCode: true,
                manufacturerCode: true,
                manufacturerPrice: true
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

        return inventory;
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
                OR: [
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

export async function deleteInventoryItemById(id: string) {
    return prisma.inventory.delete({
        where: {
            id
        }
    });
}

export async function createInventoryItem(
    prevState: ICreateInventoryItemState,
    formData: FormData
): Promise<ICreateInventoryItemState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateInventoryItem.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, failed to create inventoryItem'
        };
    }
    // Creating inventoryItem in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.inventory.create({ data });
        console.log('Successfully created inventoryItem.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create inventoryItem.'
        };
    }
    revalidatePath('/dashboard/inventory');
    redirect('/dashboard/inventory');
}

export async function updateInventoryItem(id: string, formData: FormData) {
    const rawFormData: Prisma.inventoryUpdateInput = Object.fromEntries(formData.entries());

    const data = UpdateInventoryItem.parse(rawFormData);

    // Creating inventoryItem in DB
    try {
        await prisma.inventory.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated inventoryItem.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete inventoryItem.');
    }
    revalidatePath('/dashboard/inventory');
    redirect('/dashboard/inventory');
}

export async function deleteInventoryItem(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Deleting inventoryItem in DB
    try {
        await deleteInventoryItemById(id);
        const successMessage = 'Successfully deleted inventoryItem.';
        console.log(successMessage);

        revalidatePath('/dashboard/inventory');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: failed to delete Inventory Item.');
    }
}
