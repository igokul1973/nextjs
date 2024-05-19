'use client';

import { components } from '@/app/components/dashboard/avatar-menu/constants';
import OrganizationForm from '@/app/components/organizations/form/OrganizationForm';
import {
    organizationCreateSchema,
    organizationUpdateSchema,
    organizationUpdateSchemaEmptyLogo
} from '@/app/components/organizations/form/formSchema';
import {
    TOrganizationForm,
    TOrganizationFormOutput
} from '@/app/components/organizations/form/types';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createOrganization, updateOrganization } from '@/app/lib/data/organization';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IProviderOrgFormDataProps } from './types';

const ProviderOrgFormData: FC<IProviderOrgFormDataProps> = ({
    localIdentifierName,
    rawDefaultValues,
    isEdit
}) => {
    const t = useI18n();
    const {
        state: { user }
    } = useUser();
    const userId = user.id;
    const { openSnackbar } = useSnackbar();
    const { push } = useRouter();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

    const logoFile = !rawDefaultValues.logo
        ? null
        : new File([rawDefaultValues.logo.data], rawDefaultValues.logo.name, {
              type: rawDefaultValues.logo.type
          });

    const defaultValues = {
        ...rawDefaultValues,
        logo:
            rawDefaultValues.logo === null || logoFile === null
                ? null
                : { ...rawDefaultValues.logo, data: logoFile }
    };

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields, ...formState },
        ...methods
    } = useForm<TOrganizationForm, unknown, TOrganizationFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? organizationUpdateSchema
                    : organizationUpdateSchemaEmptyLogo
                : organizationCreateSchema
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w]);

    const onSubmit = async (formData: TOrganizationFormOutput) => {
        try {
            const { logo, ...formDataWithoutLogo } = formData;
            let logoFormData: FormData | undefined = undefined;
            if (logo) {
                logoFormData = new FormData();
                Object.entries(logo).forEach(([key, value]) => {
                    (logoFormData as FormData).append(key, value as FormDataEntryValue);
                });
            }
            if (isEdit) {
                const updatedProvider = await updateOrganization(
                    formDataWithoutLogo,
                    dirtyFields,
                    userId,
                    logoFormData
                );

                if (!updatedProvider) {
                    throw new Error('Could not update provider.');
                }

                openSnackbar('Successfully updated provider.');
            } else {
                const createdProvider = await createOrganization(formData, userId, logoFormData);
                if (!createdProvider) {
                    throw new Error('Could not create provider.');
                }
                openSnackbar('Successfully created provider.');
            }
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(error.message, 'error');
            }
        }
    };

    const goBack = () => {
        const { component, title, icon } = components.account;

        rightDrawerDispatch({
            payload: { childComponent: component, title, icon },
            type: 'open'
        });
    };

    return (
        <FormProvider
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            formState={{ errors, dirtyFields, isDirty, ...formState }}
            {...methods}
        >
            <OrganizationForm
                localIdentifierName={localIdentifierName}
                isEdit={isEdit}
                isCustomer
                onSubmit={onSubmit}
            >
                <Button type='button' onClick={goBack} variant='outlined' color='warning'>
                    {capitalize(t('cancel'))}
                </Button>
            </OrganizationForm>
        </FormProvider>
    );
};
export default ProviderOrgFormData;
