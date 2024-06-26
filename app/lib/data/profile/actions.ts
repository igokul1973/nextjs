'use server';

import {
    getProfileCreateSchema,
    getProfileUpdateSchema,
    getProfileUpdateSchemaEmptyAvatar
} from '@/app/components/profile/form/formSchema';
import {
    TProfileCreateFormOutput,
    TProfileFormOutputEmptyAvatar,
    TProfileUpdateFormOutput
} from '@/app/components/profile/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import {
    deleteFileInStorage,
    getApp,
    getAvatarCreateOrUpdate,
    getDirtyValues,
    getPartialApp,
    uploadFileAndGetUrl
} from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Prisma } from '@prisma/client';

export async function createProfile(
    formDataWithoutAvatar: Omit<TProfileCreateFormOutput, 'avatar'>,
    rawAvatarFormData?: FormData
) {
    const t = await getI18n();
    try {
        console.log(formDataWithoutAvatar, rawAvatarFormData);

        const { user, account } = await getPartialApp();
        if (!user || !account) {
            throw new Error('Could not find user or account');
        }
        const userId = user?.id;

        const avatarFormData = rawAvatarFormData
            ? Object.fromEntries(rawAvatarFormData.entries())
            : null;
        const formData = { ...formDataWithoutAvatar, avatar: avatarFormData };

        const validationSchema = getProfileCreateSchema(t);
        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('Profile registration form is invalid');
        }

        const validatedData = validatedFormData.data;
        const { avatar, ...profileData } = validatedData;

        const createdProfile = await prisma.profile.create({
            include: {
                avatar: true
            },
            data: profileData
        });

        // Upload and then save an avatar here
        const avatarCreateOrUpdate = await getAvatarCreateOrUpdate(
            validatedData.avatar,
            userId,
            account.id,
            createdProfile.id,
            false
        );

        let updatedProfile = null;

        if (avatarCreateOrUpdate) {
            updatedProfile = await prisma.profile.update({
                include: {
                    avatar: true
                },
                data: {
                    avatar: avatarCreateOrUpdate
                },
                where: {
                    id: createdProfile.id
                }
            });
        }

        return updatedProfile ?? createdProfile;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('could not create user profile');
    }
}

export async function updateProfile(
    formDataWithoutAvatar: Omit<TProfileUpdateFormOutput, 'avatar'>,
    dirtyFields: TDirtyFields<TProfileUpdateFormOutput>,
    rawAvatarFormData?: FormData
) {
    const t = await getI18n();
    try {
        const { user, account, profile } = await getApp();
        const userId = user.id;

        const avatarFormData = rawAvatarFormData
            ? Object.fromEntries(rawAvatarFormData.entries())
            : null;
        const formData = { ...formDataWithoutAvatar, avatar: avatarFormData };

        const validationSchema = formData.avatar?.id
            ? getProfileUpdateSchema(t)
            : getProfileUpdateSchemaEmptyAvatar(t);

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<
            TProfileUpdateFormOutput | TProfileFormOutputEmptyAvatar
        >(dirtyFields, validatedData);

        if (!changedFields) {
            throw Error('No changes detected');
        }

        let avatarCreateOrUpdate: Prisma.fileUpdateOneWithoutProfileNestedInput | undefined =
            undefined;

        if (changedFields.avatar?.name && changedFields.avatar?.data) {
            const { data, ...avatar } = changedFields.avatar;
            // Deleting old file upload first
            if (profile?.avatar?.name) {
                await deleteFileInStorage(
                    profile?.avatar?.name,
                    'images',
                    account.id,
                    formDataWithoutAvatar.id
                );
            }
            // Uploading new file and getting its URL
            const { url } = await uploadFileAndGetUrl(
                data,
                'images',
                account.id,
                formDataWithoutAvatar.id
            );

            if (url) {
                if ('id' in avatar && avatar.id) {
                    avatarCreateOrUpdate = {
                        update: {
                            data: {
                                ...avatar,
                                url,
                                updatedBy: userId
                            }
                        }
                    };
                } else {
                    avatarCreateOrUpdate = {
                        create: {
                            ...avatar,
                            url,
                            createdBy: userId,
                            updatedBy: userId
                        }
                    };
                }
            } else {
                throw new Error(t('could not upload avatar'));
            }
        } else if (changedFields.avatar === null) {
            // Deleting old file upload first
            if (profile?.avatar?.name) {
                await deleteFileInStorage(
                    profile?.avatar?.name,
                    'images',
                    account.id,
                    formDataWithoutAvatar.id
                );
            }
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

        console.log('Successfully updated user profile item with ID:', validatedData.id);

        return updatedProfile;
    } catch (error) {
        console.error('Error: ', error);
        throw new Error(t('could not update user profile'));
    }
}
