'use server';

import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateCountry } from '.';
import { ICreateCountryState } from './types';

export async function createCountry(formData: FormData): Promise<ICreateCountryState> {
    console.log('Form data: ', formData);
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
    // const data: Prisma.countryCreateInput = {};

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
    console.log(rawFormData);

    // const data = UpdateCountry.parse(rawFormData);

    // Updating country in DB
    try {
        // await prisma.country.update({
        //     where: {
        //         id
        //     },
        //     data
        // });
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
export async function deleteCountryItemById(id: string) {
    return prisma.inventory.delete({
        where: {
            id
        }
    });
}
