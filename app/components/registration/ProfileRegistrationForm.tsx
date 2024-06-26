'use client';

import FileInput from '@/app/components/file/FileInput';
import { getProfileCreateSchema } from '@/app/components/profile/form/formSchema';
import { TProfileCreateForm, TProfileCreateFormOutput } from '@/app/components/profile/form/types';
import { getDefaultValues } from '@/app/components/profile/form/utils';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { usePartialApp } from '@/app/context/user/provider';
import { createProfile } from '@/app/lib/data/profile/actions';
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
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Warning from '../warning/Warning';
import { StyledForm } from './styled';

const localStorageKey = 'profileData';

const ProfileRegistrationForm: FC = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user },
        dispatch: appStateDispatch
    } = usePartialApp();
    const { push } = useRouter();

    const [isDeleteLocalStorageData, setIsDeleteLocalStorageData] = useState(false);

    // Try to get profile-related data from the local storage
    const profileData = getFromLocalStorage(localStorageKey) ?? {};

    const defaultValues = populateForm<TProfileCreateForm>(
        getDefaultValues(user?.id ?? ''),
        profileData
    );

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, isValid, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TProfileCreateForm, unknown, TProfileCreateFormOutput>({
        resolver: zodResolver(getProfileCreateSchema(t)),
        reValidateMode: 'onChange',
        defaultValues,
        shouldFocusError: false
    });

    const w = watch();

    useEffect(() => {
        console.log('Watch:', w);
        // console.log('IsValid:', isValid);
        if (isDeleteLocalStorageData) {
            deleteFromLocalStorage(localStorageKey);
        } else {
            setLocalStorage(localStorageKey, JSON.stringify({ ...w, avatar: undefined }));
        }
        // console.error('Errors:', errors);
    }, [errors, w, dirtyFields, isDeleteLocalStorageData]);

    const [canFocus, setCanFocus] = useState(true);

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onError = () => {
        setCanFocus(true);
    };

    const onSubmit = async (formData: TProfileCreateFormOutput) => {
        try {
            const { avatar, ...formDataWithoutAvatar } = formData;

            let avatarFormData: FormData | undefined;

            if (avatar) {
                avatarFormData = new FormData();
                Object.entries(avatar).forEach(([key, value]) => {
                    (avatarFormData as FormData).append(key, value as FormDataEntryValue);
                });
            }
            const createdProfile = await createProfile(formDataWithoutAvatar, avatarFormData);
            if (!createdProfile) {
                throw Error(t('could not create user profile'));
            }

            appStateDispatch({
                type: 'update',
                payload: {
                    profile: createdProfile
                }
            });
            // Removing the user-related data from the local storage
            setIsDeleteLocalStorageData(true);
            openSnackbar(capitalize(t('successfully created user profile')));
            // Moving to the next stage
            push('/registration');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    return !user ? (
        <Warning variant='h4'>The user object is not provided. Redirecting...</Warning>
    ) : (
        <>
            <Typography variant='h1'>Profile Registration Form</Typography>
            <FormProvider
                control={control}
                watch={watch}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                formState={{ errors, dirtyFields, isDirty, isValid, ...formState }}
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
                    <Button type='submit' variant='contained' color='primary' disabled={!isValid}>
                        {capitalize(t('next'))}
                    </Button>
                </StyledForm>
            </FormProvider>
        </>
    );
};

export default ProfileRegistrationForm;
