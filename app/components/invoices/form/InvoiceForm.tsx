'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createInvoice, updateInvoice } from '@/app/lib/data/invoice';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chip, capitalize } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
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
import { Control, Controller, useForm } from 'react-hook-form';
import DateInput from '../../date-input/DateInput';
import FormSelect from '../../form-select/FormSelect';
import { getDefaultFormValues } from '../utils';
import { invoiceCreateSchema, invoiceUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { IProps, TInvoiceForm } from './types';

const InvoiceForm: FC<IProps> = ({ customers, form }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { user } = useUser();
    const userId = user.id;
    const { push } = useRouter();

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        control
    } = useForm({
        resolver: zodResolver(form ? invoiceUpdateSchema : invoiceCreateSchema),
        reValidateMode: 'onBlur',
        defaultValues: form || getDefaultFormValues(userId)
    });

    const w = watch();

    useEffect(() => {
        console.log('DirtyFields:', dirtyFields);
        console.log('Watch:', w);
        console.error('Errors:', errors);
    }, [errors, w, dirtyFields]);

    const statuses = Object.values(InvoiceStatusEnum);

    const isSubmittable = !!isDirty;

    const onSubmit = async (formData: TInvoiceForm) => {
        try {
            if (formData.id) {
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

    const addCustomerData = () => {};

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
                        capitalize(
                            t(errors.customerId?.message as TSingleTranslationKeys, { count: 1 })
                        )
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
                            capitalize(
                                t(errors.number?.message as TSingleTranslationKeys, { count: 1 })
                            )
                        }
                        {...register('number')}
                    />
                </FormControl>

                <FormControl>
                    <DateInput
                        label={capitalize(t('date'))}
                        required
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
                                    {capitalize(t(status))}
                                </Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>

                <FormControl>
                    <DateInput
                        label={capitalize(t('latest payment date'))}
                        name='payBy'
                        control={control as Control}
                        format='YYYY-MM-DD'
                        helperText={capitalize(t('enter the date the invoice must be paid by'))}
                    />
                </FormControl>

                <FormControl>
                    <Controller
                        name='purchaseOrderNumbers'
                        control={control}
                        render={({ field: { onChange, ...field } }) => {
                            return (
                                <Autocomplete
                                    multiple
                                    id='tags-filled'
                                    options={[]}
                                    freeSolo
                                    onChange={(a, b) => {
                                        onChange(b);
                                    }}
                                    renderTags={(value: readonly string[], getTagProps) => {
                                        return value.map((option: string, index: number) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (
                                                <Chip
                                                    key={key}
                                                    variant='outlined'
                                                    label={option}
                                                    {...tagProps}
                                                />
                                            );
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!errors.purchaseOrderNumbers}
                                            helperText={
                                                !!errors.purchasOrderNumbers &&
                                                capitalize(t('enter purchase order numbers'))
                                            }
                                            label={capitalize(t('purchase order numbers'))}
                                            placeholder={capitalize(
                                                t('enter purchase order numbers')
                                            )}
                                        />
                                    )}
                                    {...field}
                                />
                            );
                        }}
                    />
                </FormControl>

                <FormControl>
                    <Controller
                        name='manufacturerInvoiceNumbers'
                        control={control}
                        render={({ field: { onChange, ...field } }) => {
                            return (
                                <Autocomplete
                                    multiple
                                    id='tags-filled'
                                    options={[]}
                                    freeSolo
                                    onChange={(a, b) => {
                                        onChange(b);
                                    }}
                                    renderTags={(value: readonly string[], getTagProps) => {
                                        return value.map((option: string, index: number) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (
                                                <Chip
                                                    key={key}
                                                    variant='outlined'
                                                    label={option}
                                                    {...tagProps}
                                                />
                                            );
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!errors.purchaseOrderNumbers}
                                            helperText={
                                                !!errors.purchasOrderNumbers &&
                                                capitalize(
                                                    t(
                                                        'enter manufacturer invoice numbers (you can enter multiple)'
                                                    )
                                                )
                                            }
                                            label={capitalize(t('manufacturer invoice numbers'))}
                                            placeholder={capitalize(
                                                t('enter manufacturer invoice numbers')
                                            )}
                                        />
                                    )}
                                    {...field}
                                />
                            );
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        label={capitalize(t('additional information'))}
                        variant='outlined'
                        placeholder={capitalize(
                            t('enter any additional information such as payment terms, etc.')
                        )}
                        error={!!errors.additionalInformation}
                        helperText={
                            !!errors.additionalInformation &&
                            capitalize(t(errors.number?.message as TSingleTranslationKeys))
                        }
                        {...register('additionalInformation')}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        label={capitalize(t('payment information'))}
                        variant='outlined'
                        placeholder={capitalize(
                            t(
                                'enter payment information such as payment method and/or bank routing and account'
                            )
                        )}
                        error={!!errors.paymentInfo}
                        helperText={
                            !!errors.paymentInfo &&
                            capitalize(t(errors.number?.message as TSingleTranslationKeys))
                        }
                        {...register('paymentInfo')}
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
                        {capitalize(t(form ? 'update invoice' : 'create invoice'))}
                    </Button>
                </Box>
            </StyledForm>
        </LocalizationProvider>
    );
};

export default InvoiceForm;
