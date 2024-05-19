'use server';

import {
    profileUpdateSchema,
    profileUpdateSchemaEmptyAvatar
} from '@/app/components/profile/form/formSchema';
import {
    TProfileFormOutput,
    TProfileFormOutputEmptyAvatar
} from '@/app/components/profile/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TProfile } from '@/app/lib/types';
import { Prisma } from '@prisma/client';
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
        console.log(formData);
        // const newProfile = await prisma.profile.create({
        //     data: formData
        // });
        // console.log('Successfully created new inventory item: ', newProfile);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to create inventory.');
    }
}

export async function updateProfile(
    rawFormData: FormData,
    dirtyFields: TDirtyFields<TProfileFormOutput>,
    userId: string,
    rawAvatarFormData?: FormData
) {
    try {
        const formData = Object.fromEntries(rawFormData.entries()) as unknown as TProfileFormOutput;
        if (typeof formData.avatar === 'string' && formData.avatar === 'null') {
            formData.avatar = null;
        }

        if (rawAvatarFormData && formData.avatar) {
            const avatarFormData = Object.fromEntries(
                rawAvatarFormData.entries()
            ) as unknown as TProfileFormOutput['avatar'];
            formData.avatar = avatarFormData;
        }

        const validationSchema = formData.avatar?.id
            ? profileUpdateSchema
            : profileUpdateSchemaEmptyAvatar;

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TProfileFormOutput | TProfileFormOutputEmptyAvatar>(
            dirtyFields,
            validatedData
        );

        if (!changedFields) {
            return null;
        }

        const avatarFile = changedFields.avatar?.data;
        const avatarArrayBuffer = await avatarFile?.arrayBuffer();

        const buffer = avatarArrayBuffer && Buffer.from(avatarArrayBuffer);

        let avatarCreateOrUpdate: Prisma.fileUpdateOneWithoutProfileNestedInput | undefined =
            undefined;

        if (changedFields.avatar && buffer) {
            if ('id' in changedFields.avatar && changedFields.avatar.id) {
                avatarCreateOrUpdate = {
                    update: {
                        data: {
                            ...changedFields.avatar,
                            data: buffer,
                            updatedBy: userId
                        }
                    }
                };
            } else {
                avatarCreateOrUpdate = {
                    create: {
                        ...changedFields.avatar,
                        data: buffer,
                        createdBy: userId,
                        updatedBy: userId
                    }
                };
            }
        } else if (changedFields.avatar === null) {
            avatarCreateOrUpdate = {
                delete: true
            };
        }

        const data: Prisma.profileUpdateInput = {
            ...changedFields,
            updatedBy: userId,
            avatar: avatarCreateOrUpdate
        };

        const updatedProfile = await prisma.profile.update({
            include: {
                avatar: true
            },
            where: {
                id: validatedData.id
            },
            data
        });

        console.log('Successfully updated profile item with ID:', validatedData.id);

        return updatedProfile;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update user profile.');
    }
}
