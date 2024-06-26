'use server';

import { TProfileUpdateFormOutput } from '@/app/components/profile/form/types';
import { getSettingsUpdateSchema } from '@/app/components/settings/form/formSchema';
import {
    TCreateSettingsFormOutput,
    TUpdateSettingsFormOutput
} from '@/app/components/settings/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import { getApp, getDirtyValues } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Prisma } from '@prisma/client';

export async function createSettings(formData: TCreateSettingsFormOutput) {
    const t = await getI18n();
    try {
        const { account, profile } = await getApp();
        const createdSettings = await prisma.settings.create({
            data: formData
        });
        console.log(
            `Successfully created account ${account.id} settings: `,
            createdSettings,
            ' by the user ',
            profile?.firstName + ' ' + profile?.lastName
        );
        return createdSettings;
    } catch (error) {
        console.error('Error:', error);
        throw new Error(t('could not create account settings'));
    }
}

export async function updateSettings(
    formData: TUpdateSettingsFormOutput,
    dirtyFields: TDirtyFields<TProfileUpdateFormOutput>
) {
    const t = await getI18n();
    try {
        const { user } = await getApp();
        const userId = user.id;

        const validationSchema = getSettingsUpdateSchema(t);

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TUpdateSettingsFormOutput>(dirtyFields, validatedData);

        if (!changedFields) {
            throw Error('No changes detected');
        }

        const data: Prisma.profileUpdateInput = {
            ...changedFields,
            updatedBy: userId
        };

        const updatedSettings = await prisma.settings.update({
            where: {
                id: validatedData.id
            },
            data
        });

        console.log('Successfully updated account settings with ID:', validatedData.id);

        return updatedSettings;
    } catch (error) {
        console.error('Error: ', error);
        throw new Error(t('could not update account settings'));
    }
}
