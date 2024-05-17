'use client';

import { components } from '@/app/components/dashboard/avatar-menu/constants';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { updateProfile } from '@/app/lib/data/profile';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TDirtyFields } from '@/app/lib/types';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUploadOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
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

    if (!rawProfile) {
        return <Warning>{capitalize(t('please create user profile first'))}</Warning>;
    }

    // FIXME: isEdit === true for now...
    const isEdit = true;

    // let avatar = null;
    // if (isEdit) {

    // }
    const avatarFile =
        rawProfile.avatar === null
            ? null
            : new File([rawProfile.avatar.data], rawProfile.avatar.name, {
                  type: rawProfile.avatar.type
              });

    const profile = {
        ...rawProfile,
        avatar:
            rawProfile.avatar === null || avatarFile === null
                ? null
                : { ...rawProfile.avatar, data: avatarFile }
    };

    const defaultValues = populateForm<TProfileForm>(getDefaultValues(user.id), profile);

    const {
        // watch,
        register,
        handleSubmit,
        control,
        setValue,
        resetField,
        formState: { errors, isDirty, dirtyFields }
    } = useForm<TProfileForm, unknown, TProfileFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.avatar
                    ? profileUpdateSchema
                    : profileUpdateSchemaEmptyAvatar
                : profileCreateSchema
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Is Dirty:', isDirty);
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

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
                    throw Error('Failed to update profile.');
                }

                userDispatch({ type: 'setProfile', payload: { profile: updatedProfile } });
                openSnackbar('Successfully updated profile.');

                goBack();
            } else {
                // await createProfile(formData);
                openSnackbar('Successfully created profile.');
            }
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(error.message, 'error');
            }
        }
    };

    // const isSubmittable = anyTrue(dirtyFields);
    const isSubmittable = isDirty;

    const deleteAvatar = () => {
        setValue('avatar', null, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    const handleChangeAvatar = (event: ChangeEvent<HTMLInputElement>): void => {
        let avatar: (typeof defaultValues)['avatar'] | null = null;
        if (event.target.files?.[0]) {
            const { name, size, type } = event.target.files[0];
            const aa = {
                name,
                size,
                type,
                data: event.target.files[0],
                createdBy: user.id,
                updatedBy: user.id
            };
            const a = defaultValues['avatar'];
            avatar = a ? { ...a, ...aa } : { ...aa, id: '' };
        }

        if (avatar) {
            setValue('avatar', avatar, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            });
        }
    };

    const avatarError = errors.avatar;
    const getAvatarErrorMessage = (error: NonNullable<typeof avatarError>) => {
        if ('message' in error) {
            return capitalize(t(error.message as TSingleTranslationKeys));
        } else if ('id' in error && error.id) {
            return capitalize(t(error.id.message as TSingleTranslationKeys));
        } else if ('name' in error && error.name) {
            return capitalize(t(error.name.message as TSingleTranslationKeys));
        } else if ('size' in error && error.size) {
            return capitalize(t(error.size.message as TSingleTranslationKeys));
        } else if ('type' in error && error.type) {
            return capitalize(t((error.type as FieldError).message as TSingleTranslationKeys));
        } else if ('data' in error && error.data) {
            return capitalize(t(error.data.message as TSingleTranslationKeys, { count: 200 }));
        } else {
            return '';
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            capitalize(t(errors.firstName?.message as TSingleTranslationKeys))
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
                            capitalize(t(errors.lastName?.message as TSingleTranslationKeys))
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
                <FormControl variant='filled'>
                    <Controller
                        name='avatar'
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => {
                            return (
                                <TextField
                                    variant='outlined'
                                    label={capitalize(t('avatar'))}
                                    placeholder={capitalize(
                                        t('click icon to the right to upload avatar')
                                    )}
                                    type='text'
                                    // value={(a && a.length && a[0].name) || ''}
                                    value={value && 'name' in value ? value.name : ''}
                                    error={!!avatarError}
                                    helperText={
                                        !!avatarError
                                            ? getAvatarErrorMessage(avatarError)
                                            : capitalize(
                                                  t(
                                                      'square picture (png, jpg, jpeg, webp, or svg) with max file size: kb#many',
                                                      {
                                                          count: 200
                                                      }
                                                  )
                                              )
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <>
                                                <Tooltip
                                                    title={capitalize(t('click to change avatar'))}
                                                >
                                                    <IconButton component='label'>
                                                        <FileUploadOutlined color='info' />
                                                        <input
                                                            style={{ display: 'none' }}
                                                            type='file'
                                                            hidden
                                                            onChange={handleChangeAvatar}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip
                                                    title={capitalize(t('click to delete avatar'))}
                                                >
                                                    <IconButton
                                                        component='button'
                                                        onClick={deleteAvatar}
                                                    >
                                                        <DeleteIcon color='warning' />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )
                                    }}
                                    {...field}
                                />
                            );
                        }}
                    />
                </FormControl>
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
        </LocalizationProvider>
    );
};

export default ProfileForm;
