'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { usePartialApp } from '@/app/context/user/provider';
import { createUser } from '@/app/lib/data/user/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import {
    deleteFromLocalStorage,
    getFromLocalStorage,
    maskMax3Digits,
    maskNumber,
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
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyledForm } from './styled';
import { TUserRegistrationForm } from './types';
import { getDefaultValues, getUserRegistrationSchema } from './utils';

const localStorageKey = 'userData';

const UserRegistrationForm: FC<{ userEmail: string }> = ({ userEmail }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { dispatch: appStateDispatch } = usePartialApp();
    const { push } = useRouter();

    const [isDeleteLocalStorageData, setIsDeleteLocalStorageData] = useState(false);

    // Try to get user-related data from the local storage
    const userData = getFromLocalStorage(localStorageKey) ?? {};

    const defaultValues = populateForm<TUserRegistrationForm>(
        getDefaultValues(userEmail),
        userData
    );

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isValid }
    } = useForm<TUserRegistrationForm, unknown, TUserRegistrationForm>({
        resolver: zodResolver(getUserRegistrationSchema(t)),
        reValidateMode: 'onChange',
        defaultValues,
        shouldFocusError: false
    });

    const w = watch();

    useEffect(() => {
        // console.log('Is Dirty:', isDirty);
        // console.log('DirtyFields:', dirtyFields);
        console.log('Watch:', w);
        console.log('IsValid:', isValid);
        if (isDeleteLocalStorageData) {
            deleteFromLocalStorage(localStorageKey);
        } else {
            setLocalStorage(localStorageKey, JSON.stringify(w));
        }
        // console.error('Errors:', errors);
    }, [errors, w, dirtyFields, isDeleteLocalStorageData]);

    const [canFocus, setCanFocus] = useState(true);

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onError = () => {
        setCanFocus(true);
    };

    const onSubmit = async (formData: TUserRegistrationForm) => {
        try {
            const createdUser = await createUser(formData);

            if (!createdUser) {
                throw Error(t('could not create user'));
            }
            // Setting user and account into the partial app context
            appStateDispatch({
                type: 'update',
                payload: {
                    account: createdUser.account,
                    user: createdUser
                }
            });
            // Removing the user-related data from the local storage
            setIsDeleteLocalStorageData(true);
            openSnackbar(capitalize(t('successfully created user')));
            // Moving to the next stage
            debugger;
            push('/registration');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    return (
        <>
            <Typography variant='h1'>User Registration Form</Typography>
            <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <FormControl>
                    <TextField
                        label={capitalize(t('email'))}
                        placeholder={capitalize(t('email'))}
                        variant='outlined'
                        error={!!errors.email}
                        required
                        helperText={errors.email?.message && capitalize(errors.email.message)}
                        {...register('email')}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        sx={{ overflowX: 'clip' }}
                        title={capitalize(t('must be up to digits', { count: 3 }))}
                        label={capitalize(t('phone country code'))}
                        autoComplete='tel-country-code'
                        inputProps={{
                            type: 'number',
                            inputMode: 'numeric',
                            maxLength: 4
                        }}
                        InputProps={{
                            startAdornment: '+'
                        }}
                        variant='outlined'
                        required
                        error={!!errors.countryCode}
                        helperText={
                            !!errors.countryCode?.message && capitalize(errors.countryCode.message)
                        }
                        {...register('countryCode', {
                            onChange: maskMax3Digits
                        })}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('phone number'))}
                        autoComplete='tel-national'
                        inputProps={{
                            type: 'text'
                        }}
                        variant='outlined'
                        required
                        error={!!errors.number}
                        helperText={errors.number?.message && capitalize(errors.number.message)}
                        {...register('number', {
                            onChange: (e) => {
                                maskNumber(e);
                            },
                            setValueAs: (value) => {
                                if (!value) return value;
                                const e = {
                                    target: { value: value.toString() }
                                } as unknown as ChangeEvent<HTMLInputElement>;
                                maskNumber(e);
                                return e.target.value;
                            }
                        })}
                    />
                </FormControl>
                <Button type='submit' variant='contained' color='primary' disabled={!isValid}>
                    {capitalize(t('next'))}
                </Button>
            </StyledForm>
        </>
    );
};

export default UserRegistrationForm;
