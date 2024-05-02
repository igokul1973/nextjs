'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createInvoice, updateInvoice } from '@/app/lib/data/invoice';
import { maskPercentage } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import PercentIcon from '@mui/icons-material/Percent';
import CustomerIcon from '@mui/icons-material/Portrait';
import { Chip, Divider, capitalize } from '@mui/material';
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
import { FC, memo, useEffect } from 'react';
import {
    Control,
    Controller,
    FieldValues,
    FormProvider,
    useFieldArray,
    useForm
} from 'react-hook-form';
import DateInput from '../../date-input/DateInput';
import FormSelect from '../../form-select/FormSelect';
import PartialInvoiceItemForm from '../invoice-items/form/PartialInvoiceItemForm';
import { getDefaultFormValues, getInoiceItemsInitial } from '../utils';
import { invoiceCreateSchema, invoiceUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { IProps, TInvoiceForm, TInvoiceFormOutput } from './types';

const InvoiceForm: FC<IProps> = ({ customers, inventory, form }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { user, account } = useUser();
    const userId = user.id;
    const { push } = useRouter();

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TInvoiceForm, unknown, TInvoiceFormOutput>({
        resolver: zodResolver(form ? invoiceUpdateSchema : invoiceCreateSchema),
        reValidateMode: 'onChange',
        defaultValues: form || getDefaultFormValues(userId)
    });

    const w = watch();

    useEffect(() => {
        console.log('DirtyFields:', dirtyFields);
        console.log('Watch:', w);
        console.error('Errors:', errors);
    }, [errors, w, dirtyFields]);

    const {
        fields: invoiceItems,
        append: appendInvoiceItem,
        remove: removeInvoiceItem
    } = useFieldArray({
        name: 'invoiceItems',
        control
    });

    const statuses = Object.values(InvoiceStatusEnum);

    const isSubmittable = !!isDirty;

    const onSubmit = async (formData: TInvoiceFormOutput) => {
        try {
            if (formData.id) {
                await updateInvoice(formData, dirtyFields, userId);
                openSnackbar('Successfully updated invoice.');
            } else {
                await createInvoice(formData);
                openSnackbar('Successfully created invoice.');
            }
            push('/dashboard/invoices');
        } catch (error) {
            openSnackbar(`Failed to create customer: ${error}`, 'error');
        }
    };

    const CustomerAdornment = memo(function CustomerAdornment() {
        return <CustomerIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />;
    });

    return (
        <FormProvider
            control={control}
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            setValue={setValue}
            formState={{ errors, isDirty, dirtyFields, ...formState }}
            {...methods}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Customer Name */}
                    <FormSelect
                        name='customerId'
                        label={capitalize(t('customer'))}
                        placeholder={capitalize(t('select customer'))}
                        control={control as unknown as Control<FieldValues>}
                        required
                        startAdornment={<CustomerAdornment />}
                        error={!!errors.customerId}
                        helperText={
                            !!errors.customerId &&
                            capitalize(
                                t(errors.customerId?.message as TSingleTranslationKeys, {
                                    count: 1
                                })
                            )
                        }
                    >
                        <MenuItem disabled>{capitalize(t('select customer'))}</MenuItem>
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
                            label={capitalize(t('invoice number'))}
                            variant='outlined'
                            placeholder={capitalize(t('enter the invoice number'))}
                            required
                            error={!!errors.number}
                            helperText={
                                !!errors.number &&
                                capitalize(
                                    t(errors.number?.message as TSingleTranslationKeys, {
                                        count: 1
                                    })
                                )
                            }
                            {...register('number')}
                        />
                    </FormControl>

                    <FormControl>
                        <DateInput
                            label={capitalize(t('invoice date'))}
                            required
                            name='date'
                            control={control as unknown as Control<FieldValues>}
                            format='YYYY-MM-DD'
                            helperText={capitalize(t('enter the invoice date'))}
                        />
                    </FormControl>

                    {/* Invoice Status */}
                    <FormSelect
                        name='status'
                        label={capitalize(t('status'))}
                        placeholder={capitalize(t('select invoice status'))}
                        control={control as unknown as Control<FieldValues>}
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

                    <Divider />
                    {invoiceItems.map((invoiceItem, index) => (
                        <PartialInvoiceItemForm
                            key={index}
                            count={invoiceItems.length}
                            index={index}
                            accountId={account.id}
                            inventory={inventory}
                            remove={removeInvoiceItem}
                        />
                    ))}

                    <Button
                        variant='contained'
                        onClick={() => appendInvoiceItem(getInoiceItemsInitial(userId))}
                    >
                        {invoiceItems.length > 0
                            ? capitalize(t('add another invoice item'))
                            : capitalize(t('add invoice item'))}
                    </Button>
                    <Divider />
                    <FormControl fullWidth>
                        <TextField
                            label={capitalize(t('discount'))}
                            inputProps={{
                                type: 'number',
                                inputMode: 'decimal',
                                min: 0,
                                max: 100,
                                minLength: 1,
                                step: '0.01'
                            }}
                            InputProps={{
                                startAdornment: (
                                    <PercentIcon
                                        sx={{
                                            color: 'action.active',
                                            fontSize: '1.2rem',
                                            marginRight: 1
                                        }}
                                    />
                                )
                            }}
                            variant='outlined'
                            required
                            error={!!errors.discount}
                            helperText={
                                !!errors.discount &&
                                capitalize(t(errors.discount.message as TSingleTranslationKeys))
                            }
                            {...register('discount', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    maskPercentage(e);
                                    setValue('discount', e.target.valueAsNumber);
                                }
                            })}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            label={capitalize(t('tax'))}
                            inputProps={{
                                type: 'number',
                                inputMode: 'decimal',
                                min: 0,
                                max: 100,
                                minLength: 1,
                                step: '0.01'
                            }}
                            InputProps={{
                                startAdornment: (
                                    <PercentIcon
                                        sx={{
                                            color: 'action.active',
                                            fontSize: '1.2rem',
                                            marginRight: 1
                                        }}
                                    />
                                )
                            }}
                            variant='outlined'
                            required
                            error={!!errors.tax}
                            helperText={
                                !!errors.tax &&
                                capitalize(t(errors.tax.message as TSingleTranslationKeys))
                            }
                            {...register('tax', {
                                valueAsNumber: true,
                                onChange: (e) => {
                                    maskPercentage(e);
                                    setValue('tax', e.target.valueAsNumber);
                                }
                            })}
                        />
                    </FormControl>

                    <FormControl>
                        <DateInput
                            label={capitalize(t('latest payment date'))}
                            name='payBy'
                            control={control as unknown as Control<FieldValues>}
                            format='YYYY-MM-DD'
                            helperText={capitalize(t('enter the date the invoice must be paid by'))}
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
                    <FormControl>
                        <TextField
                            multiline
                            minRows={2}
                            maxRows={5}
                            label={capitalize(t('terms'))}
                            variant='outlined'
                            placeholder={capitalize(t('enter payment terms'))}
                            error={!!errors.additionalInformation}
                            helperText={
                                !!errors.additionalInformation &&
                                capitalize(t(errors.number?.message as TSingleTranslationKeys))
                            }
                            {...register('terms')}
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
                                t('enter any additional information for customer')
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
                        <DateInput
                            label={capitalize(t('paid on date'))}
                            name='paidOn'
                            control={control as unknown as Control<FieldValues>}
                            format='YYYY-MM-DD'
                            helperText={capitalize(
                                t('enter the date the invoice have been paid on')
                            )}
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
                                                    !!errors.purchaseOrderNumbers &&
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
                                                error={!!errors.manufacturerInvoiceNumbers}
                                                helperText={
                                                    !!errors.manufacturerInvoiceNumbers &&
                                                    capitalize(
                                                        t(
                                                            'enter manufacturer invoice numbers (you can enter multiple)'
                                                        )
                                                    )
                                                }
                                                label={capitalize(
                                                    t('manufacturer invoice numbers')
                                                )}
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
                            label={capitalize(t('notes'))}
                            variant='outlined'
                            placeholder={capitalize(t('enter notes (for internal use)'))}
                            error={!!errors.additionalInformation}
                            helperText={
                                !!errors.additionalInformation &&
                                capitalize(t(errors.number?.message as TSingleTranslationKeys))
                            }
                            {...register('notes')}
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
        </FormProvider>
    );
};

export default InvoiceForm;
