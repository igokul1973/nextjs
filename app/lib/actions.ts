'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from './prisma';
import { deleteInvoiceById } from './data/invoices';

const FormSchema = z.object({
    id: z.string(),
    customer_id: z.string({
        invalid_type_error: 'Please select a customer'
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than 0' })
        .transform((val) => {
            return Math.floor(val * 100);
        }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status'
    }),
    date: z.coerce.date()
});

export interface ICreateInvoiceState {
    message?: string | null;
    errors?: {
        customer_id?: string[];
        amount?: string[];
        status?: string[];
        date?: string[];
    };
}

const UpdateInvoice = FormSchema.omit({ id: true });
const CreateInvoice = FormSchema.omit({ id: true });

export async function createInvoice(
    prevState: ICreateInvoiceState,
    formData: FormData
): Promise<ICreateInvoiceState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateInvoice.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, failed to create invoice'
        };
    }
    // Creating invoice in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.invoices.create({ data });
        console.log('Successfully created invoice.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create invoice.'
        };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;

    const data = UpdateInvoice.parse(rawFormData);

    // Creating invoice in DB
    try {
        await prisma.invoice.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated invoice.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Creating invoice in DB
    try {
        await deleteInvoiceById(id);
        const successMessage = 'Successfully deleted invoice.';
        console.log(successMessage);

        revalidatePath('/dashboard/invoices');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: failed to delete Invoice.');
    }
}

export async function authenticate(_: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials';
                default:
                    return 'Something went wrong during authentication.';
            }
        }
        throw error;
    }
}

export async function getInvoice() {
    await prisma.invoice.findFirst({
        select: {
            id: true,
            customer: true
        }
    });
}
