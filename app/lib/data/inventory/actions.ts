'use server';

import { DEFAULT_ITEMS_PER_PAGE } from '@/app/[locale]/dashboard/inventory/constants';
import { TInventoryFormOutput } from '@/app/components/inventory/form/types';
import prisma from '@/app/lib/prisma';
import { IBaseDataFilterArgs, TDirtyFields } from '@/app/lib/types';
import { getDirtyValues, getUser } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TInventoryTransformed, getQueryFilterWhereClause } from './types';

export async function getFilteredInventoryByAccountIdRaw({
    accountId,
    query,
    page = 0,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    orderBy = 'name',
    order = 'asc'
}: IBaseDataFilterArgs): Promise<TInventoryTransformed[]> {
    noStore();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) {
        return redirect('/');
    }

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
