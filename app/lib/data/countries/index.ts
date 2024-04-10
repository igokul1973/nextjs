'use server';

import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
    ICreateCountryState,
    TGetCountryPayload,
    getCountriesSelect,
    getQueryFilterWhereClause
} from './types';

const ITEMS_PER_PAGE = 10;

const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: `Please enter country's name`
    })
});

const CreateCountry = FormSchema.omit({ id: true });
const UpdateCountry = FormSchema.omit({ id: true });

export async function getCountryById(id: string): Promise<TGetCountryPayload | null> {
    noStore();
    try {
        const country = await prisma.country.findFirst({
            relationLoadStrategy: 'query',
            select: getCountriesSelect,
            where: {
                id
            }
        });

        return country;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get country.');
    }
}

export async function getCountries(): Promise<TGetCountryPayload[]> {
    noStore();
    try {
        const countries = await prisma.country.findMany({
            relationLoadStrategy: 'query'
        });

        return countries;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get countries.');
    }
}

export async function getFilteredCountries(query: string) {
    noStore();

    try {
        const countries = await prisma.country.findMany({
            relationLoadStrategy: 'join',
            orderBy: {
                name: 'asc'
            },
            select: getCountriesSelect,
            where: getQueryFilterWhereClause(query)
        });

        return countries;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get inventory.');
    }
}

export async function getFilteredCountriesCount(query: string) {
    noStore();

    try {
        const count = await prisma.country.count({
            where: getQueryFilterWhereClause(query)
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get total number of inventory.');
    }
}

export async function deleteCountryItemById(id: string) {
    return prisma.inventory.delete({
        where: {
            id
        }
    });
}

export async function createCountry(
    prevState: ICreateCountryState,
    formData: FormData
): Promise<ICreateCountryState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateCountry.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, failed to create inventoryItem'
        };
    }
    // Creating country in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.country.create({ data });
        console.log('Successfully created country.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create country.'
        };
    }
    revalidatePath('/dashboard/countries');
    redirect('/dashboard/countries');
}

export async function updateCountry(id: string, formData: FormData) {
    const rawFormData: Prisma.inventoryUpdateInput = Object.fromEntries(formData.entries());

    const data = UpdateCountry.parse(rawFormData);

    // Updating country in DB
    try {
        await prisma.country.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated country.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete country.');
    }
    revalidatePath('/dashboard/countries');
    redirect('/dashboard/countries');
}

export async function deleteCountry(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Deleting inventoryItem in DB
    try {
        await deleteCountryItemById(id);
        const successMessage = 'Successfully deleted country.';
        console.log(successMessage);

        revalidatePath('/dashboard/countries');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: failed to delete the country.');
    }
}
