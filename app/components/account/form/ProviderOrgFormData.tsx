'use client';

import OrganizationForm from '@/app/components/organizations/form/OrganizationForm';
import {
    getProviderOrgCreateSchema,
    getProviderOrgUpdateSchema,
    getProviderOrgUpdateSchemaEmptyLogo
} from '@/app/components/organizations/form/formSchema';
import {
    TProviderOrgForm,
    TProviderOrgFormOutput
} from '@/app/components/organizations/form/types';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { createOrganization, updateOrganization } from '@/app/lib/data/organization/actions';
import { deleteFromLocalStorage, setLocalStorage } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import { EntitiesEnum } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ActionButtonsContainer } from './styled';
import { IProviderOrgFormDataProps } from './types';

const localStorageKey = 'providerData';

const ProviderOrgFormData: FC<IProviderOrgFormDataProps> = ({
    user,
    localIdentifierName,
    defaultValues,
    isEdit,
    updateProviderState,
    goBack
}) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();

    const [isDeleteLocalStorageData, setIsDeleteLocalStorageData] = useState(false);

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid, dirtyFields, ...formState },
        ...methods
    } = useForm<TProviderOrgForm, unknown, TProviderOrgFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? getProviderOrgUpdateSchema(t)
                    : getProviderOrgUpdateSchemaEmptyLogo(t)
                : getProviderOrgCreateSchema(t)
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    const w = watch();

    useEffect(() => {
        console.log('Watch:', w);
        console.log('Errors:', errors);
        if (!isEdit) {
            if (isDeleteLocalStorageData) {
                deleteFromLocalStorage(localStorageKey);
            } else {
                setLocalStorage(
                    localStorageKey,
                    JSON.stringify({ ...w, providerType: EntitiesEnum.organization })
                );
            }
        }
    }, [w, isDeleteLocalStorageData, isEdit, errors]);

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
                    throw new Error('Gould not update provider');
                }
                updateProviderState(updatedProvider);
                openSnackbar(capitalize(t('successfully updated provider')));
            } else {
                const createdProvider = await createOrganization(formDataWithoutLogo, logoFormData);
                if (!createdProvider) {
                    throw new Error(capitalize(t('could not create provider')));
                }
                updateProviderState(createdProvider);
                openSnackbar(capitalize(t('successfully created provider')));
                setIsDeleteLocalStorageData(true);
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
            formState={{ errors, dirtyFields, isDirty, isValid, ...formState }}
            {...methods}
        >
            <OrganizationForm
                user={user}
                providerLocalIdentifierName={localIdentifierName}
                isCustomer={false}
                onSubmit={onSubmit}
            >
                {isEdit ? (
                    <ActionButtonsContainer>
                        <Button type='button' onClick={goBack} variant='outlined' color='warning'>
                            {capitalize(t('cancel'))}
                        </Button>
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            disabled={!isDirty && !isValid}
                        >
                            {capitalize(t(isEdit ? 'update provider' : 'create provider'))}
                        </Button>
                    </ActionButtonsContainer>
                ) : (
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!isDirty && !isValid}
                    >
                        {capitalize(t('next'))}
                    </Button>
                )}
            </OrganizationForm>
        </FormProvider>
    );
};
export default ProviderOrgFormData;
