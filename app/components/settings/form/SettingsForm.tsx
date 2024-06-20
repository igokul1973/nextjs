'use client';

import FileInput from '@/app/components/file/FileInput';
import Warning from '@/app/components/warning/Warning';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { updateSettings } from '@/app/lib/data/settings/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TDirtyFields } from '@/app/lib/types';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getSettingsCreateSchema, getSettingsUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { TSettingsForm, TSettingsFormOutput } from './types';
import { getDefaultValues } from './utils';

const SettingsForm: FC<IProps> = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user, profile },
        dispatch: userDispatch
    } = useUser();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

    // FIXME: isEdit === true for now...
    const isEdit = true;

    const defaultValues = populateForm<TSettingsForm>(getDefaultValues(user.id), profile || {});

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TSettingsForm, unknown, TSettingsFormOutput>({
        resolver: zodResolver(isEdit ? getSettingsUpdateSchema(t) : getSettingsCreateSchema(t)),
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

    if (!profile) {
        return <Warning>{capitalize(t('please create account settings first'))}</Warning>;
    }

    const onError = () => {
        setCanFocus(true);
    };

    const goBack = () => {
        rightDrawerDispatch({
            payload: { childComponentName: 'settings' },
            type: 'open'
        });
    };

    const onSubmit = async (formData: TSettingsFormOutput) => {
        try {
            let avatarFormData: FormData | undefined;

            if (isEdit) {
                const updatedSettings = await updateSettings(
                    formData,
                    dirtyFields as TDirtyFields<TSettingsFormOutput>,
                    avatarFormData
                );

                if (!updatedSettings) {
                    throw Error(t('could not update account settings'));
                }

                userDispatch({ type: 'setSettings', payload: { settings: updatedSettings } });
                openSnackbar(capitalize(t('successfully updated account settings')));

                goBack();
            } else {
                // await createSettings(formData);
                openSnackbar(capitalize(t('successfully created account settings')));
            }
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
                <FormControl>
                    <TextField
                        label={capitalize(t('first name'))}
                        placeholder={capitalize(t('first name'))}
                        variant='outlined'
                        error={!!errors.firstName}
                        required
                        helperText={
                            !!errors.firstName?.message && capitalize(errors.firstName.message)
                        }
                        {...register('firstName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('last name'))}
                        variant='outlined'
                        placeholder={capitalize(t('last name'))}
                        required
                        error={!!errors.lastName}
                        helperText={
                            !!errors.lastName?.message && capitalize(errors.lastName.message)
                        }
                        {...register('lastName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('middle name'))}
                        placeholder={capitalize(t('middle name'))}
                        variant='outlined'
                        {...register('middleName')}
                    />
                </FormControl>
                <FileInput inputName='avatar' label={capitalize(t('avatar'))} user={user} />
                <Box className='action-buttons'>
                    <Button type='button' onClick={goBack} variant='outlined' color='warning'>
                        {capitalize(t('cancel'))}
                    </Button>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!isSubmittable}
                    >
                        {capitalize(t(isEdit ? 'update settings' : 'create settings'))}
                    </Button>
                </Box>
            </StyledForm>
        </FormProvider>
    );
};

export default SettingsForm;
