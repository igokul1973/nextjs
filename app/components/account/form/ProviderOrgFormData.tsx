'use client';

import OrganizationForm from '@/app/components/organizations/form/OrganizationForm';
import {
    getOrganizationCreateSchema,
    getProviderOrgUpdateSchema,
    getProviderOrgUpdateSchemaEmptyLogo
} from '@/app/components/organizations/form/formSchema';
import {
    TProviderOrgForm,
    TProviderOrgFormOutput
} from '@/app/components/organizations/form/types';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { createOrganization, updateOrganization } from '@/app/lib/data/organization/actions';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ActionButtonsContainer } from './styled';
import { IProviderOrgFormDataProps } from './types';

const ProviderOrgFormData: FC<IProviderOrgFormDataProps & PropsWithChildren> = ({
    user,
    localIdentifierName,
    defaultValues,
    isEdit,
    updateProviderState,
    goBack,
    children
}) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const isDisplayActionButtons = isEdit;

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields, ...formState },
        ...methods
    } = useForm<TProviderOrgForm, unknown, TProviderOrgFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? getProviderOrgUpdateSchema(t)
                    : getProviderOrgUpdateSchemaEmptyLogo(t)
                : getOrganizationCreateSchema(t)
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w]);

    const onSubmit = async (formData: TProviderOrgFormOutput) => {
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
                    logo?.name,
                    logoFormData
                );

                if (!updatedProvider) {
                    throw new Error('could not update provider');
                }
                updateProviderState(updatedProvider);
                openSnackbar(capitalize(t('successfully updated provider')));
            } else {
                const createdProvider = await createOrganization(formData, logoFormData);
                if (!createdProvider) {
                    throw new Error(capitalize(t('could not create provider')));
                }
                updateProviderState(createdProvider);
                openSnackbar(capitalize(t('successfully created provider')));
            }
            goBack && goBack();
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(t(error.message as TSingleTranslationKey)), 'error');
            }
        }
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
                user={user}
                providerLocalIdentifierName={localIdentifierName}
                isCustomer={false}
                onSubmit={onSubmit}
            >
                {children}
                {isDisplayActionButtons && (
                    <ActionButtonsContainer>
                        <Button type='button' onClick={goBack} variant='outlined' color='warning'>
                            {capitalize(t('cancel'))}
                        </Button>
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            disabled={!isDirty}
                        >
                            {capitalize(t(isEdit ? 'update provider' : 'create provider'))}
                        </Button>
                    </ActionButtonsContainer>
                )}
            </OrganizationForm>
        </FormProvider>
    );
};
export default ProviderOrgFormData;
