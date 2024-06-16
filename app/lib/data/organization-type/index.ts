'use server';

import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
    ICreateOrganizationTypeState,
    TGetOrganizationTypePayload,
    getOrganizationTypesSelect,
    getQueryFilterWhereClause
} from './types';

const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: `Please enter organizationType's name`
    })
});

const CreateOrganizationType = FormSchema.omit({ id: true });
const UpdateOrganizationType = FormSchema.omit({ id: true });

export async function getOrganizationTypeById(
    id: string
): Promise<TGetOrganizationTypePayload | null> {
    noStore();
    try {
        const organizationType = await prisma.organizationType.findFirst({
            relationLoadStrategy: 'query',
            select: getOrganizationTypesSelect,
            where: {
                id
            }
        });

        return organizationType;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get organizationType.');
    }
}

export async function getOrganizationTypes(): Promise<TGetOrganizationTypePayload[]> {
    noStore();
    try {
        const organizationTypes = await prisma.organizationType.findMany({
            relationLoadStrategy: 'query',
            orderBy: {
                type: 'asc'
            }
        });

        return organizationTypes;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get organizationTypes.');
    }
}

export async function getFilteredOrganizationTypes(query: string) {
    noStore();

    try {
        const organizationTypes = await prisma.organizationType.findMany({
            relationLoadStrategy: 'join',
            orderBy: {
                type: 'asc'
            },
            select: getOrganizationTypesSelect,
            where: getQueryFilterWhereClause(query)
        });

        return organizationTypes;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get inventory.');
    }
}

export async function getFilteredOrganizationTypesCount(query: string) {
    noStore();

    try {
        const count = await prisma.organizationType.count({
            where: getQueryFilterWhereClause(query)
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get total number of inventory.');
    }
}

export async function deleteOrganizationTypeItemById(id: string) {
    return prisma.inventory.delete({
        where: {
            id
        }
    });
}

export async function createOrganizationType(
    prevState: ICreateOrganizationTypeState,
    formData: FormData
): Promise<ICreateOrganizationTypeState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateOrganizationType.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, could not create inventoryItem'
        };
    }
    // Creating organizationType in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.organizationType.create({ data });
        console.log('Successfully created organizationType.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'could not create organizationType.'
        };
    }
    revalidatePath('/dashboard/organizationTypes');
    redirect('/dashboard/organizationTypes');
}

export async function updateOrganizationType(id: string, formData: FormData) {
    const rawFormData: Prisma.inventoryUpdateInput = Object.fromEntries(formData.entries());

    const data = UpdateOrganizationType.parse(rawFormData);

    // Updating organizationType in DB
    try {
        await prisma.organizationType.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated organizationType.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not delete organizationType.');
    }
    revalidatePath('/dashboard/organizationTypes');
    redirect('/dashboard/organizationTypes');
}

export async function deleteOrganizationType(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Deleting organizationType in DB
    try {
        await deleteOrganizationTypeItemById(id);
        const successMessage = 'Successfully deleted organizationType.';
        console.log(successMessage);

        revalidatePath('/dashboard/organizationTypes');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not delete the organizationType.');
    }
}
