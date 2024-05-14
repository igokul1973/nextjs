'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { updateProfile } from '@/app/lib/data/profile';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NextLink from 'next/link';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { components } from '../../dashboard/avatar-menu/constants';
import Warning from '../../warning/Warning';
import { profileCreateSchema, profileUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { IProps, TProfileForm, TProfileFormOutput } from './types';
import { getDefaultValues } from './utils';

const ProfileForm: FC<IProps> = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user, profile },
        dispatch: userDispatch
    } = useUser();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

    if (!profile) {
        return <Warning>{capitalize(t('please create user profile first'))}</Warning>;
    }

    // TODO: for now...
    const isEdit = true;

    const defaultValues = populateForm<TProfileForm>(getDefaultValues(user.id), profile);

    const {
        // watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        control
    } = useForm<TProfileForm, unknown, TProfileFormOutput>({
        resolver: zodResolver(isEdit ? profileUpdateSchema : profileCreateSchema),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onSubmit = async (formData: TProfileFormOutput) => {
        try {
            if (isEdit) {
                const updatedProfile = await updateProfile(formData, dirtyFields, user.id);
                const { component, title, icon } = components.profile;
                rightDrawerDispatch({
                    payload: { childComponent: component, title, icon },
                    type: 'open'
                });
                userDispatch({ type: 'setProfile', payload: { profile: updatedProfile } });
                openSnackbar('Successfully updated profile.');
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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <FormControl>
                    <TextField
                        type='file'
                        label={capitalize(t('first name'))}
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
                <Box className='action-buttons'>
                    <Button
                        component={NextLink}
                        href='/dashboard'
                        variant='outlined'
                        color='warning'
                    >
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
