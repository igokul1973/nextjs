'use server';

import { TInventoryFormOutput } from '@/app/components/inventory/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import { getDirtyValues } from '@/app/lib/utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';

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
        const updatedInventoryItem = await prisma.inventory.update({
            where: {
                id: formData.id
            },
            data
        });

        console.log('Successfully updated inventory item with ID:', formData.id);
        revalidatePath('/dashboard/inventory');
        return updatedInventoryItem;
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
