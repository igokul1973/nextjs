'use client';

import BaseLinkButton from '@/app/components/buttons/base/BaseLinkButton';
import { createCustomer } from '@/app/lib/data/customers';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { FC } from 'react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { StyledForm } from './styled';
import { IProps } from './types';

const OrganizationForm: FC<IProps> = ({ countries }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm();

    const t = useI18n();
    const initialState = { message: null, errors: {}, touched: false };
    const [state, formAction] = useFormState(createCustomer, initialState);

    const onSubmit = (formData: FieldValues) => {
        const FormSchema = z.object({
            id: z.string(),
            name: z.string({
                invalid_type_error: 'Please enter first name'
            }),
            isPrivate: z.boolean().optional(),
            isCharity: z.boolean().optional(),
            addressLine1: z.string({
                invalid_type_error: 'Please enter the address'
            }),
            addressLine2: z.string().optional(),
            addressLine3: z.string().optional(),
            locality: z.string({
                invalid_type_error: 'Please enter city/village/locality'
            }),
            region: z.string({
                invalid_type_error: 'Please enter region/state'
            }),
            postalcode: z.string({
                invalid_type_error: 'Please enter zip/postal code'
            }),
            country: z.string({
                invalid_type_error: 'Please enter the country'
            })
        });
        const CreateCustomer = FormSchema.omit({ id: true });
        console.log('Form data: ', formData);
        const dateISOString = new Date().toISOString();
        formData.date = dateISOString;
        // Validate form using Zod
        const validatedForm = CreateCustomer.safeParse(formData);
        console.log('Validated form:', validatedForm);
        console.log('Errors:', errors);
        if (!validatedForm.success) {
            return {
                errors: validatedForm.error.flatten().fieldErrors,
                message: 'Missing fields, failed to create customer'
            };
        }
    };

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <TextField
                    label={capitalize(t('name'))}
                    variant='outlined'
                    placeholder={capitalize(t('name'))}
                    required
                    {...register('name', {
                        required: capitalize(t('please enter the company name'))
                    })}
                />
            </FormControl>
            <FormControl>
                <TextField
                    multiline
                    minRows={2}
                    maxRows={5}
                    label={capitalize(t('description'))}
                    variant='outlined'
                    placeholder={capitalize(t('description'))}
                    {...register('description')}
                />
            </FormControl>
            <FormControl>
                <FormControlLabel
                    label={capitalize(t('is private'))}
                    control={
                        <Controller
                            name={'isPrivate'}
                            control={control}
                            defaultValue={false}
                            render={({ field: props }) => (
                                <Checkbox
                                    {...props}
                                    checked={props.value}
                                    onChange={(e) => props.onChange(e.target.checked)}
                                />
                            )}
                        />
                    }
                />
            </FormControl>
            <FormControl>
                <FormControlLabel
                    label={capitalize(t('is charity'))}
                    control={
                        <Controller
                            name={'isCharity'}
                            defaultValue={false}
                            control={control}
                            render={({ field: props }) => (
                                <Checkbox
                                    {...props}
                                    checked={props.value}
                                    onChange={(e) => props.onChange(e.target.checked)}
                                />
                            )}
                        />
                    }
                />
            </FormControl>

            <Box className='action-buttons'>
                <BaseLinkButton
                    href='/dashboard/customers'
                    name='Cancel'
                    color='warning'
                    variant='outlined'
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={!!state.errors?.customerId}
                >
                    Create Customer
                </Button>
            </Box>
        </StyledForm>
    );
};
export default OrganizationForm;
