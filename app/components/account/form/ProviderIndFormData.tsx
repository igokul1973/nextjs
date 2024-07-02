'use client';

import IndividualForm from '@/app/components/individuals/form/IndividualForm';
import {
    getProviderIndCreateSchema,
    getProviderIndUpdateSchema,
    getProviderIndUpdateSchemaEmptyLogo
} from '@/app/components/individuals/form/formSchema';
import { TProviderIndForm, TProviderIndFormOutput } from '@/app/components/individuals/form/types';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { createIndividual, updateIndividual } from '@/app/lib/data/indiviidual/actions';
import { TDirtyFields } from '@/app/lib/types';
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
import { IProviderIndFormDataProps } from './types';

const localStorageKey = 'providerData';

const ProviderIndFormData: FC<IProviderIndFormDataProps> = ({
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
    } = useForm<TProviderIndForm, unknown, TProviderIndFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? getProviderIndUpdateSchema(t)
                    : getProviderIndUpdateSchemaEmptyLogo(t)
                : getProviderIndCreateSchema(t)
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    const w = watch();

    useEffect(() => {
        // console.log('Watch:', w);
        // console.log('errors:', errors);
        if (!isEdit) {
            if (isDeleteLocalStorageData) {
                deleteFromLocalStorage(localStorageKey);
            } else {
                setLocalStorage(
                    localStorageKey,
                    JSON.stringify({ ...w, providerType: EntitiesEnum.individual })
                );
            }
        }
    }, [w, isDeleteLocalStorageData, isEdit]);

    const onSubmit = async (formData: TProviderIndFormOutput) => {
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
                const updatedProvider = await updateIndividual(
                    formDataWithoutLogo,
                    dirtyFields as TDirtyFields<TProviderIndFormOutput>,
                    logo?.name,
                    logoFormData
                );

                if (!updatedProvider) {
                    throw new Error('could not update provider');
                }
                updateProviderState(updatedProvider);

                openSnackbar(capitalize(t('successfully updated provider')));
            } else {
                const createdProvider = await createIndividual(formDataWithoutLogo, logoFormData);
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
            formState={{ errors, dirtyFields, isValid, isDirty, ...formState }}
            {...methods}
        >
            <IndividualForm
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
            </IndividualForm>
        </FormProvider>
    );
};
export default ProviderIndFormData;
