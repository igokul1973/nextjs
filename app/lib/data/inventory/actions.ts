'use server';

import { TInventoryFormOutput } from '@/app/components/inventory/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import { getDirtyValues, getUser } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInventoryItem(formData: TInventoryFormOutput) {
    const session = await auth();
    if (!session) redirect('/');
    const t = await getI18n();
    try {
        // TODO: Validate fields
        const newInventoryItem = await prisma.inventory.create({
            data: formData
        });

        console.log('Successfully created new inventory item: ', newInventoryItem);
        revalidatePath('/dashboard/inventory');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(t('could not create inventory item'));
    }
}
export async function updateInventoryItem(
    formData: TInventoryFormOutput,
    dirtyFields: TDirtyFields<TInventoryFormOutput>
) {
    const t = await getI18n();
    const { user } = await getUser();

    // TODO: Validate fields
    const changedFields = getDirtyValues<TInventoryFormOutput>(dirtyFields, formData);

    if (!changedFields) {
        throw Error('No changes detected');
    }

    const data = { ...changedFields, updatedBy: user.id };

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
        console.error('Error:', error);
        throw new Error(t('could not update inventory item'));
    }
}
export async function deleteInventoryItemById(id: string) {
    const session = await auth();
    if (!session) redirect('/');
    const t = await getI18n();

    try {
        if (!id) {
            throw Error('The id must be a valid UUID');
        }
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
            throw new Error(t('cannot delete inventory item because it has associated invoices'));
        }
        throw new Error(t('could not delete inventory item'));
    }
}
