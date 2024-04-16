'use server';

import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
    ICreateLocalIdentifierNameState,
    TGetLocalIdentifierNamePayload,
    getLocalIdentifierNamesSelect,
    getQueryFilterWhereClause
} from './types';

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: `Please enter localIdentifierName's name`
    })
});

const CreateLocalIdentifier = FormSchema.omit({ id: true });
const UpdateLocalIdentifier = FormSchema.omit({ id: true });

export async function getLocalIdentifierNamesByCountryId(
    id: string
): Promise<TGetLocalIdentifierNamePayload[]> {
    noStore();
    try {
        const localIdentifierName = await prisma.localIdentifierName.findMany({
            relationLoadStrategy: 'query',
            select: getLocalIdentifierNamesSelect,
            where: {
                countryId: id
            }
        });

        return localIdentifierName;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get localIdentifierName.');
    }
}

export async function getLocalIdentifierNames(): Promise<TGetLocalIdentifierNamePayload[]> {
    noStore();
    try {
        const localIdentifierNames = await prisma.localIdentifierName.findMany({
            relationLoadStrategy: 'query'
        });

        return localIdentifierNames;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get local identifier names.');
    }
}

export async function getFilteredLocalIdentifierNames(query: string) {
    noStore();

    try {
        const localIdentifiers = await prisma.localIdentifierName.findMany({
            relationLoadStrategy: 'join',
            orderBy: {
                name: 'asc'
            },
            select: getLocalIdentifierNamesSelect,
            where: getQueryFilterWhereClause(query)
        });

        return localIdentifiers;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get inventory.');
    }
}

export async function getFilteredLocalIdentifierNamesCount(query: string) {
    noStore();

    try {
        const count = await prisma.localIdentifierName.count({
            where: getQueryFilterWhereClause(query)
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get total number of inventory.');
    }
}

export async function deleteLocalIdentifierItemById(id: string) {
    return prisma.inventory.delete({
        where: {
            id
        }
    });
}

export async function createLocalIdentifier(
    prevState: ICreateLocalIdentifierNameState,
    formData: FormData
): Promise<ICreateLocalIdentifierNameState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateLocalIdentifier.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, failed to create inventoryItem'
        };
    }
    // Creating localIdentifierName in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.localIdentifierName.create({ data });
        console.log('Successfully created localIdentifierName.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create localIdentifierName.'
        };
    }
    revalidatePath('/dashboard/localIdentifiers');
    redirect('/dashboard/localIdentifiers');
}

export async function updateLocalIdentifier(id: string, formData: FormData) {
    const rawFormData: Prisma.inventoryUpdateInput = Object.fromEntries(formData.entries());

    const data = UpdateLocalIdentifier.parse(rawFormData);

    // Updating localIdentifierName in DB
    try {
        await prisma.localIdentifierName.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated localIdentifierName.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete localIdentifierName.');
    }
    revalidatePath('/dashboard/localIdentifiers');
    redirect('/dashboard/localIdentifiers');
}

export async function deleteLocalIdentifier(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Deleting inventoryItem in DB
    try {
        await deleteLocalIdentifierItemById(id);
        const successMessage = 'Successfully deleted localIdentifierName.';
        console.log(successMessage);

        revalidatePath('/dashboard/localIdentifiers');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: failed to delete the localIdentifierName.');
    }
}
