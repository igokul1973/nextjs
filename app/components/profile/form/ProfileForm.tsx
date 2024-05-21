'use client';

import { components } from '@/app/components/dashboard/avatar-menu/constants';
import FileInput from '@/app/components/file/FileInput';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { updateProfile } from '@/app/lib/data/profile';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TDirtyFields } from '@/app/lib/types';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Warning from '../../warning/Warning';
import {
    profileCreateSchema,
    profileUpdateSchema,
    profileUpdateSchemaEmptyAvatar
} from './formSchema';
import { StyledForm } from './styled';
import { IProps, TProfileForm, TProfileFormOutput } from './types';
import { getDefaultValues } from './utils';

const ProfileForm: FC<IProps> = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user, profile: rawProfile },
        dispatch: userDispatch
    } = useUser();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

    // FIXME: isEdit === true for now...
    const isEdit = true;

    // let avatar = null;
    // if (isEdit) {

    // }
    const avatarFile = !rawProfile?.avatar
        ? null
        : new File([rawProfile?.avatar.data], rawProfile?.avatar.name, {
              type: rawProfile?.avatar.type
          });

    const profile = {
        ...rawProfile,
        avatar:
            rawProfile?.avatar === null || avatarFile === null
                ? null
                : { ...rawProfile?.avatar, data: avatarFile }
    };

    const defaultValues = populateForm<TProfileForm>(getDefaultValues(user.id), profile);

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TProfileForm, unknown, TProfileFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.avatar
                    ? profileUpdateSchema
                    : profileUpdateSchemaEmptyAvatar
                : profileCreateSchema
        ),
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

    if (!rawProfile) {
        return <Warning>{capitalize(t('please create user profile first'))}</Warning>;
    }

    const onError = () => {
        setCanFocus(true);
    };

    const goBack = () => {
        const { component, title, icon } = components.profile;

        rightDrawerDispatch({
            payload: { childComponent: component, title, icon },
            type: 'open'
        });
    };

    const onSubmit = async (formData: TProfileFormOutput) => {
        try {
            if (isEdit) {
                const newFormData = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    newFormData.append(key, value as FormDataEntryValue);
                });

                let avatarFormData: FormData | undefined = undefined;
                if (formData.avatar) {
                    avatarFormData = new FormData();
                    Object.entries(formData.avatar).forEach(([key, value]) => {
                        (avatarFormData as FormData).append(key, value as FormDataEntryValue);
                    });
                }

                const updatedProfile = await updateProfile(
                    newFormData,
                    dirtyFields as TDirtyFields<TProfileFormOutput>,
                    user.id,
                    avatarFormData
                );

                if (!updatedProfile) {
                    throw Error('failed to update user profile.');
                }

                userDispatch({ type: 'setProfile', payload: { profile: updatedProfile } });
                openSnackbar(capitalize(t('successfully updated user profile')));

                goBack();
            } else {
                // await createProfile(formData);
                openSnackbar(capitalize(t('successfully created user profile')));
            }
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(t(error.message as TSingleTranslationKey)), 'error');
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
                            !!errors.firstName &&
                            capitalize(t(errors.firstName?.message as TSingleTranslationKey))
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
                            !!errors.lastName &&
                            capitalize(t(errors.lastName?.message as TSingleTranslationKey))
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
                <FileInput
                    inputName='avatar'
                    label={capitalize(t('avatar'))}
                    user={user}
                    maxFileSize={200}
                />
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
                        {capitalize(t(isEdit ? 'update profile' : 'create profile'))}
                    </Button>
                </Box>
            </StyledForm>
        </FormProvider>
    );
};

export default ProfileForm;
