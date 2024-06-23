'use client';

import FileInput from '@/app/components/file/FileInput';
import { getProfileCreateSchema } from '@/app/components/profile/form/formSchema';
import {
    TProfileCreateForm,
    TProfileCreateFormOutput,
    TProfileUpdateForm
} from '@/app/components/profile/form/types';
import { getDefaultValues } from '@/app/components/profile/form/utils';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createProfile } from '@/app/lib/data/profile/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyledForm } from './styled';

const ProfileRegistrationForm: FC = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user, profile },
        dispatch: userDispatch
    } = useUser();

    // FIXME: isEdit === true for now...
    const isEdit = false;

    const defaultValues = populateForm<TProfileUpdateForm>(
        getDefaultValues(user.id),
        profile || {}
    );

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TProfileCreateForm, unknown, TProfileCreateFormOutput>({
        resolver: zodResolver(getProfileCreateSchema(t)),
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

            openSnackbar(capitalize(t('successfully created user profile')));
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    const isSubmittable = isDirty;

    return (
        <>
            <Typography variant='h1'>Profile Registration Form</Typography>;
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
                    {/* <Box className='action-buttons'>
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
                    </Box> */}
                </StyledForm>
            </FormProvider>
        </>
    );
};

export default ProfileRegistrationForm;
