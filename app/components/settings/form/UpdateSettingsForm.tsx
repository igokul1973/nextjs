'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useApp } from '@/app/context/user/provider';
import { updateSettings } from '@/app/lib/data/settings/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TDirtyFields } from '@/app/lib/types';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PartialSettingsForm from './PartialSettingsForm';
import { getSettingsUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { TUpdateSettingsForm, TUpdateSettingsFormOutput } from './types';
import { getDefaultValues } from './utils';

const UpdateSettingsForm: FC = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { account, user, settings: rawSettings },
        dispatch: userDispatch
    } = useApp();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();
    const settings = rawSettings && { ...rawSettings, salesTax: rawSettings.salesTax / 1000 };

    const defaultValues = populateForm<TUpdateSettingsForm>(
        getDefaultValues(account.id, user.id),
        settings || {}
    );

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TUpdateSettingsForm, unknown, TUpdateSettingsFormOutput>({
        resolver: zodResolver(getSettingsUpdateSchema(t)),
        reValidateMode: 'onChange',
        defaultValues,
        shouldFocusError: false
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Is Dirty:', isDirty);
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    const [canFocus, setCanFocus] = useState(true);

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onError = () => {
        setCanFocus(true);
    };

    const goBack = () => {
        rightDrawerDispatch({
            payload: { childComponentName: 'settings' },
            type: 'open'
        });
    };

    const onSubmit = async (formData: TUpdateSettingsFormOutput) => {
        try {
            const updatedSettings = await updateSettings(
                formData,
                dirtyFields as TDirtyFields<TUpdateSettingsFormOutput>
            );

            if (!updatedSettings) {
                throw Error(t('could not update account settings'));
            }

            userDispatch({ type: 'setSettings', payload: { settings: updatedSettings } });
            openSnackbar(capitalize(t('successfully updated account settings')));

            goBack();
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    const isSubmittable = isDirty;

    return (
        <FormProvider
            control={control}
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            setValue={setValue}
            formState={{ errors, dirtyFields, isDirty, ...formState }}
            {...methods}
        >
            <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <PartialSettingsForm />
            </StyledForm>
            <Box className='action-buttons'>
                <Button type='button' onClick={goBack} variant='outlined' color='warning'>
                    {capitalize(t('cancel'))}
                </Button>
                <Button type='submit' variant='contained' color='primary' disabled={!isSubmittable}>
                    {capitalize(t('update settings'))}
                </Button>
            </Box>
        </FormProvider>
    );
};

export default UpdateSettingsForm;
