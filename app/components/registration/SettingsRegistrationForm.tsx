'use client';

import PartialSettingsForm from '@/app/components/settings/form/PartialSettingsForm';
import { getSettingsCreateSchema } from '@/app/components/settings/form/formSchema';
import {
    TCreateSettingsForm,
    TCreateSettingsFormOutput,
    TUpdateSettingsForm
} from '@/app/components/settings/form/types';
import { getDefaultValues } from '@/app/components/settings/form/utils';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { usePartialApp } from '@/app/context/user/provider';
import { createSettings } from '@/app/lib/data/settings/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import {
    deleteFromLocalStorage,
    getFromLocalStorage,
    populateForm,
    setLocalStorage
} from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyledForm, StyledProviderContainer } from './styled';

const localStorageKey = 'settingsData';

const SettingsRegistrationForm: FC = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();

    const {
        state: { account, user },
        dispatch: appStateDispatch
    } = usePartialApp();

    const { push } = useRouter();

    const [isDeleteLocalStorageData, setIsDeleteLocalStorageData] = useState(false);

    const settingsData = getFromLocalStorage(localStorageKey) ?? {};
    const settings = 'salesTax' in settingsData && {
        ...settingsData,
        salesTax: settingsData.salesTax / 1000
    };

    const defaultValues = populateForm<TUpdateSettingsForm>(
        getDefaultValues(account!.id, user!.id),
        settings
    );

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, isValid, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TCreateSettingsForm, unknown, TCreateSettingsFormOutput>({
        resolver: zodResolver(getSettingsCreateSchema(t)),
        reValidateMode: 'onChange',
        defaultValues,
        shouldFocusError: false
    });

    const w = watch();

    useEffect(() => {
        if (isDeleteLocalStorageData) {
            deleteFromLocalStorage(localStorageKey);
        } else {
            setLocalStorage(localStorageKey, JSON.stringify({ ...w, avatar: null }));
        }
    }, [w, isDeleteLocalStorageData]);

    const [canFocus, setCanFocus] = useState(true);

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onError = () => {
        setCanFocus(true);
    };

    const onSubmit = async (formData: TCreateSettingsFormOutput) => {
        try {
            const createdSettings = await createSettings(formData);

            if (!createdSettings) {
                throw Error(t('could not create account settings'));
            }

            openSnackbar(capitalize(t('successfully updated account settings')));

            appStateDispatch({
                type: 'update',
                payload: {
                    settings: createdSettings
                }
            });
            // Removing the settings-related data from the local storage
            setIsDeleteLocalStorageData(true);
            push('/registration');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    return (
        <StyledProviderContainer component='section'>
            <FormProvider
                control={control}
                watch={watch}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                formState={{ errors, dirtyFields, isValid, isDirty, ...formState }}
                {...methods}
            >
                <Typography variant='h1'>Settings Registration Form</Typography>
                <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                    <PartialSettingsForm />
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!isDirty && !isValid}
                    >
                        {capitalize(t('next'))}
                    </Button>
                </StyledForm>
            </FormProvider>
        </StyledProviderContainer>
    );
};

export default SettingsRegistrationForm;
