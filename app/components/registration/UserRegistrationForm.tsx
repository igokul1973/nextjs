'use client';

import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TTranslateFn } from '@/app/lib/types';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { UserRoleEnum } from '@prisma/client';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StyledForm } from './styled';

const getDefaultValues = (email = '', accountId = '') => {
    return {
        email,
        phone: '',
        isActive: true,
        role: UserRoleEnum.writer,
        accountId
    };
};

export const userRoles = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];

export const getUserRegistrationSchema = (t: TTranslateFn) => {
    return z.object({
        email: z
            .string()
            .min(1, { message: 'This field has to be filled.' })
            .email(t('this is not a valid email.')),
        phone: z
            .string({
                required_error: 'please enter the country',
                invalid_type_error: 'please enter the country'
            })
            .min(10, { message: 'please enter the country' }),
        isActive: z.boolean(),
        role: z.enum(userRoles, {
            invalid_type_error: t('please enter the user role')
        }),
        accountId: z.string({
            required_error: t('please enter the account ID'),
            invalid_type_error: t('please enter the account ID')
        })
    });
};

const UserRegistrationForm: FC = () => {
    const t = useI18n();

    const defaultValues = populateForm<TProfileForm>(getDefaultValues(), {});

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TProfileForm, unknown, TProfileFormOutput>({
        resolver: zodResolver(getUserRegistrationSchema(t)),
        reValidateMode: 'onChange',
        defaultValues,
        shouldFocusError: false
    });

    const [canFocus, setCanFocus] = useState(true);

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onError = () => {
        setCanFocus(true);
    };

    return (
        <>
            <Typography variant='h1'>User Registration Form</Typography>;
            <StyledForm onSubmit={handleSubmit(() => {}, onError)} noValidate>
                <FormControl>
                    <TextField
                        label={capitalize(t('email'))}
                        placeholder={capitalize(t('first name'))}
                        variant='outlined'
                        error={!!errors.email}
                        required
                        helperText={!!errors.email?.message && capitalize(errors.email.message)}
                        {...register('email')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('phone'))}
                        variant='outlined'
                        placeholder={capitalize(t('last name'))}
                        required
                        error={!!errors.lastName}
                        helperText={!!errors.phone?.message && capitalize(errors.phone.message)}
                        {...register('phone')}
                    />
                </FormControl>
            </StyledForm>
        </>
    );
};

export default UserRegistrationForm;
