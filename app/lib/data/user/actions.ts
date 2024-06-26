'use server';

import { TUserRegistrationForm } from '@/app/components/registration/types';
import { getUserRegistrationSchema } from '@/app/components/registration/utils';
import prisma from '@/app/lib/prisma';
import { auth, signIn, signOut } from '@/auth';
import { getI18n } from '@/locales/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthError } from 'next-auth';
import { getUserWithRelations } from './types';

/**
 * Create a new user along with a new account
 */
export async function createUser(formData: TUserRegistrationForm) {
    const t = await getI18n();
    try {
        const session = await auth();
        if (!session) {
            throw new Error('Could not find user session');
        }

        const validationSchema = getUserRegistrationSchema(t);

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('User registration form is invalid');
        }

        const { countryCode, number, ...validatedData } = validatedFormData.data;
        const phone = `+${countryCode}-${number}`;
        const password = process.env.AUTH_SECRET;

        if (!password || password.length < 10) {
            throw Error(
                'The env variable AUTH_SECRET is not defined or the password length there is less than 10!'
            );
        }

        const data = {
            ...validatedData,
            password,
            phone,
            account: {
                create: {
                    isActive: true
                }
            }
        };

        const createdUser = await prisma.user.create({
            include: getUserWithRelations,
            data
        });

        return createdUser;
    } catch (error) {
        console.error('Error:', error);
        const e1 = 'unique constraint failed on the fields: (`email`)';
        const e2 = 'unique constraint failed on the fields: (`phone`)';
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.message.toLocaleLowerCase().includes(e1)) {
                throw new Error(t('cannot create user - phone already exists'));
            } else if (error.message.toLocaleLowerCase().includes(e2)) {
                throw new Error(t('cannot create user - phone already exists'));
            }
        }
        throw new Error(t('could not create user'));
    }
}

export async function authenticate(_: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return 'Invalid credentials';
            } else {
                return 'Something went wrong during authentication.';
            }
        }
        throw error;
    }
}

export const signInWithGoogle = async () => {
    await signIn('google');
};

export const signInWithTwitter = async () => {
    await signIn('twitter');
};

export const signInWithFacebook = async () => {
    await signIn('facebook');
};

export async function logOut() {
    await signOut({ redirectTo: '/' });
}

export const submitRegistration = async (formData: FormData) => {
    console.log('Form data: ', formData);
};
