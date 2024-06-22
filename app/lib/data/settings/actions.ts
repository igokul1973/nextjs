'use server';

import { TProfileFormOutput } from '@/app/components/profile/form/types';
import { getSettingsUpdateSchema } from '@/app/components/settings/form/formSchema';
import { TSettingsFormOutput } from '@/app/components/settings/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import { getDirtyValues, getUser } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { Prisma } from '@prisma/client';

export async function createSettings(formData: TSettingsFormOutput) {
    const t = await getI18n();
    try {
        const { account, profile } = await getUser();
        const newProfile = await prisma.settings.create({
            data: formData
        });
        console.log(
            `Successfully created account ${account.id} settings: `,
            newProfile,
            ' by the user ',
            profile?.firstName + ' ' + profile?.lastName
        );
    } catch (error) {
        console.error('Error:', error);
        throw new Error(t('could not create account settings'));
    }
}

export async function updateSettings(
    formData: TSettingsFormOutput,
    dirtyFields: TDirtyFields<TProfileFormOutput>
) {
    const t = await getI18n();
    try {
        const { user } = await getUser();
        const userId = user.id;

        const validationSchema = getSettingsUpdateSchema(t);

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TSettingsFormOutput>(dirtyFields, validatedData);

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
