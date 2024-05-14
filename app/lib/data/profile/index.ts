'use server';

import { TProfileFormOutput } from '@/app/components/profile/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TProfile } from '@/app/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { getDirtyValues } from '../../utils';

export async function getUserProfile(userId: string): Promise<TProfile | null> {
    noStore();

    try {
        return prisma.profile.findUnique({
            where: {
                userId
            }
        });
    } catch (error) {
        console.log('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user profile.');
    }
}

export async function createProfile(formData: TProfileFormOutput) {
    try {
        const newProfile = await prisma.profile.create({
            data: formData
        });

        console.log('Successfully created new inventory item: ', newProfile);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to create inventory.');
    }
}

export async function updateProfile(
    formData: TProfileFormOutput,
    dirtyFields: TDirtyFields<TProfileFormOutput>,
    userId: string
) {
    const changedFields = getDirtyValues<TProfileFormOutput>(dirtyFields, formData);

    if (!changedFields) {
        return null;
    }

    const data = { ...changedFields, updatedBy: userId };

    try {
        const updatedProfile = await prisma.profile.update({
            where: {
                id: formData.id
            },
            data
        });

        console.log('Successfully profile item with ID:', formData.id);

        return updatedProfile;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update user profile.');
    }
}
