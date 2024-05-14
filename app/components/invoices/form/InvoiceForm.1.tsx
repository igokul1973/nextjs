'use client';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createInvoice, updateInvoice } from '@/app/lib/data/invoice';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { InvoiceStatusEnum } from '@prisma/client';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { Control, useForm } from 'react-hook-form';
import DateInput from '../../date-input/DateInput';
import FormSelect from '../../form-select/FormSelect';
import { invoiceCreateSchema, invoiceUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { IProps, TInvoiceFormOutput } from './types';

export const InvoiceForm: FC<IProps> = ({ customers, defaultValues, isEdit }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user }
    } = useUser();
    const userId = user.id;
    const { push } = useRouter();

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        control
    } = useForm({
        resolver: zodResolver(isEdit ? invoiceUpdateSchema : invoiceCreateSchema),
        reValidateMode: 'onBlur',
        defaultValues
    });

    const w = watch();

    useEffect(() => {
        console.log('DirtyFields:', dirtyFields);
        console.log('Watch:', w);
        console.error('Errors:', errors);
    }, [errors, w, dirtyFields]);

    const statuses = Object.values(InvoiceStatusEnum);

    const isSubmittable = !!isDirty;

    const onSubmit = async (formData: TInvoiceFormOutput) => {
        try {
            if (isEdit) {
                await updateInvoice(formData, dirtyFields, userId);
                openSnackbar('Successfully updated customer.');
            } else {
                await createInvoice(formData);
                openSnackbar('Successfully created customer.');
            }
            push('/dashboard/invoices');
        } catch (error) {
            openSnackbar(`Failed to create customer: ${error}`, 'error');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Customer Name */}
                <FormSelect
                    name='customerId'
                    label={capitalize(t('customer'))}
                    placeholder={capitalize(t('select customer'))}
                    control={control}
                    required
                    error={!!errors.customerId}
                    helperText={
                        !!errors.customerId &&
                        capitalize(t(errors.customerId?.message as TSingleTranslationKeys))
                    }
                >
                    {customers.map((customer) => {
                        return (
                            <MenuItem key={customer.id} value={customer.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {capitalize(customer.name)}
                                </Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>

                {/* Invoice Amount */}
                <FormControl>
                    <TextField
                        label={capitalize(t('number'))}
                        variant='outlined'
                        placeholder={capitalize(t('number'))}
                        required
                        error={!!errors.number}
                        helperText={
                            !!errors.number &&
                            capitalize(t(errors.number?.message as TSingleTranslationKeys))
                        }
                        {...register('number')}
                    />
                </FormControl>

                <FormControl>
                    <DateInput
                        label={capitalize(t('date'))}
                        name='date'
                        control={control as Control}
                        format='YYYY-MM-DD'
                        helperText={capitalize(t('enter the invoice date'))}
                    />
                </FormControl>

                {/* Invoice Status */}
                <FormSelect
                    name='status'
                    label={capitalize(t('status'))}
                    placeholder={capitalize(t('select invoice status'))}
                    control={control}
                    required
                    error={!!errors.status}
                    helperText={
                        !!errors.status &&
                        capitalize(t(errors.status?.message as TSingleTranslationKeys))
                    }
                >
                    {statuses.map((status) => {
                        return (
                            <MenuItem key={status} value={status}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {capitalize(status)}
                                </Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>

                <FormControl>
                    <Autocomplete
                        multiple
                        id='tags-filled'
                        options={top100Films.map((option) => option.title)}
                        defaultValue={[top100Films[13].title]}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                                <Chip
                                    variant='outlined'
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='filled'
                                label='freeSolo'
                                placeholder='Favorites'
                            />
                        )}
                    />
                </FormControl>
                <Box className='action-buttons'>
                    <Button
                        component={NextLink}
                        href='/dashboard/invoices'
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
                        {capitalize(t(isEdit ? 'update invoice' : 'create invoice'))}
                    </Button>
                </Box>
            </StyledForm>
        </LocalizationProvider>
    );
};
