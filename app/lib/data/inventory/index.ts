'use server';

import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { TOrder } from '../../types';
import { formatCurrency } from '../../utils';
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
