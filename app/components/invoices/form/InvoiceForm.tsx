'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { getFilteredCustomersByAccountId } from '@/app/lib/data/customer/actions';
import { createInvoice, updateInvoice } from '@/app/lib/data/invoice/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import {
    formatCurrencyAsCents,
    getInvoiceSubtotalTaxAndDiscount,
    getInvoiceTotal,
    useDebounce
} from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import EmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import CustomerIcon from '@mui/icons-material/Portrait';
import { Chip, Divider, InputAdornment, Tooltip, capitalize } from '@mui/material';
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
import { useParams, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';
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
import { getInoiceItemsInitial } from '../utils';
import { getInvoiceCreateSchema, getInvoiceUpdateSchema } from './formSchema';
import { StyledForm, Totals } from './styled';
import { IProps, TCustomerOutput, TInvoiceForm, TInvoiceFormOutput } from './types';

const CustomerAdornment = () => {
    return (
        <InputAdornment position='start'>
            <CustomerIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        </InputAdornment>
    );
};

const InvoiceForm: FC<IProps> = ({
    customers: initialCustomers,
    inventory,
    measurementUnits,
    accountId,
    providerPhones,
    providerEmails,
    defaultValues,
    isEdit
}) => {
    const t = useI18n();
    const { locale } = useParams<{ locale: string }>();
    const { openSnackbar } = useSnackbar();
    const {
        state: { user, account, settings }
    } = useUser();
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
        resolver: zodResolver(isEdit ? getInvoiceUpdateSchema(t) : getInvoiceCreateSchema(t)),
        reValidateMode: 'onChange',
        defaultValues,
        shouldFocusError: false
    });

    const [invoiceTotal, setInvoiceTotal] = useState(0);
    const [invoiceSubtotal, setInvoiceSubtotal] = useState(0);
    const [taxTotal, setTaxTotal] = useState(0);
    const [discountTotal, setDiscountTotal] = useState(0);

    const form = watch();

    useEffect(() => {
        console.log('DirtyFields:', dirtyFields);
        console.log('Watch:', form);
        console.error('Errors:', errors);
    }, [errors, form, dirtyFields]);

    const {
        fields: invoiceItems,
        append: appendInvoiceItem,
        remove: removeInvoiceItem
    } = useFieldArray({
        name: 'invoiceItems',
        control
    });

    const recalculateTotals = useCallback(() => {
        const data = form.invoiceItems.map((ii) => {
            return {
                price: Number(ii.price || 0),
                quantity: Number(ii.quantity || 0),
                salesTax: Number(ii.salesTax || 0),
                discount: Number(ii.discount || 0)
            };
        });
        const invoiceTotal = getInvoiceTotal(data);
        const { subtotal, taxTotal, discountTotal } = getInvoiceSubtotalTaxAndDiscount(data);
        setInvoiceTotal(invoiceTotal);
        setInvoiceSubtotal(subtotal);
        setTaxTotal(taxTotal);
        setDiscountTotal(discountTotal);
    }, [form.invoiceItems]);

    const statuses = Object.values(InvoiceStatusEnum);

    const isSubmittable = isDirty;

    const [customers, setCustomers] = useState<TCustomerOutput[]>(initialCustomers);

    const getCustomers = async (query: string) => {
        if (!query) {
            return setCustomers(initialCustomers);
        }
        const customers = await getFilteredCustomersByAccountId({
            accountId,
            query,
            page: 0,
            itemsPerPage: 25
        });
        setCustomers(customers);
    };

    const debouncedHandleGetCustomers = useDebounce<string>(getCustomers, 300);

    const setAdditionalCustomerValues = (customer: TInvoiceForm['customer'] | null) => {
        if (customer?.customerLocalIdentifierNameAbbrev) {
            setValue(
                'customerLocalIdentifierNameAbbrev',
                customer.customerLocalIdentifierNameAbbrev
            );
            setValue('customerLocalIdentifierValue', customer.customerLocalIdentifierValue);
        } else {
            setValue('customerLocalIdentifierNameAbbrev', '');
            setValue('customerLocalIdentifierValue', '');
        }
    };

    const onSubmit = async (formData: TInvoiceFormOutput) => {
        try {
            if (isEdit) {
                const updatedInvoice = await updateInvoice(formData, dirtyFields);
                if (!updatedInvoice) {
                    throw new Error(t('could not update invoice'));
                }
                openSnackbar(capitalize(t('successfully updated invoice')));
            } else {
                const createdInvoice = await createInvoice(formData);
                if (!createdInvoice) {
                    throw new Error(t('could not create invoice'));
                }
                openSnackbar(capitalize(t('successfully created invoice')));
            }
            push('/dashboard/invoices');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
                if (
                    error.cause === 'NO_PROVIDER' ||
                    error.cause === 'NO_CUSTOMER' ||
                    error.cause === 'NO_INVOICE'
                ) {
                    // FIXME: Gotta redirect to create provider page in case
                    // there is not provider
                    push('/dashboard');
                }
            }
        }
    };

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

    const customerError = errors.customer;

    return (
        <>
            <Totals>
                <Box>
                    {capitalize(t('subtotal (before tax and discount)'))}:{' '}
                    <Box component='span' color='secondary.main'>
                        {formatCurrencyAsCents(invoiceSubtotal, locale)}
                    </Box>
                </Box>
                <Box>
                    {capitalize(t('tax total'))}:{' '}
                    <Box component='span' color='secondary.main'>
                        {formatCurrencyAsCents(taxTotal, locale)}
                    </Box>
                </Box>
                <Box>
                    {capitalize(t('discount total'))}:{' '}
                    <Box component='span' color='secondary.main'>
                        {formatCurrencyAsCents(discountTotal, locale)}
                    </Box>
                </Box>
                <Box>
                    {capitalize(t('invoice total'))}:{' '}
                    <Box component='span' color='secondary.main'>
                        {formatCurrencyAsCents(invoiceTotal, locale)}
                    </Box>
                </Box>
            </Totals>
            <FormProvider
                control={control}
                watch={watch}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                formState={{ errors, dirtyFields, isDirty, ...formState }}
                {...methods}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                        {/* Customer */}

                        <FormControl fullWidth>
                            <Controller
                                name='customer'
                                control={control}
                                render={({ field: { onChange, ref, value, ...field } }) => {
                                    return (
                                        <Autocomplete
                                            value={
                                                value
                                                    ? customers.find(
                                                          (option) =>
                                                              option.customerId === value.customerId
                                                      )
                                                    : null
                                            }
                                            options={customers}
                                            onInputChange={(_, value) => {
                                                if (
                                                    !value ||
                                                    !customers.find((c) =>
                                                        c.customerName.includes(value)
                                                    )
                                                ) {
                                                    debouncedHandleGetCustomers(value);
                                                }
                                            }}
                                            getOptionLabel={(option) => option.customerName}
                                            onChange={(_, customer) => {
                                                setAdditionalCustomerValues(customer);
                                                onChange(customer);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: <CustomerAdornment />
                                                    }}
                                                    error={!!customerError}
                                                    helperText={
                                                        !!customerError &&
                                                        'message' in customerError &&
                                                        customerError.message &&
                                                        capitalize(customerError.message)
                                                    }
                                                    label={capitalize(t('customer'))}
                                                    placeholder={capitalize(t('select customer'))}
                                                    inputRef={ref}
                                                />
                                            )}
                                            {...field}
                                        />
                                    );
                                }}
                            />
                        </FormControl>

                        {/* Invoice Amount */}
                        <FormControl>
                            <TextField
                                label={capitalize(t('invoice number'))}
                                variant='outlined'
                                placeholder={capitalize(t('enter the invoice number'))}
                                required
                                error={!!errors.number}
                                helperText={
                                    !!errors.number?.message && capitalize(errors.number.message)
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
                                helperText={capitalize(t('enter the invoice date'))}
                            />
                        </FormControl>

                        <FormSelect
                            name='status'
                            label={capitalize(t('status'))}
                            placeholder={capitalize(t('select invoice status'))}
                            control={control as unknown as Control<FieldValues>}
                            required
                            error={!!errors.status}
                            helperText={
                                !!errors.status?.message && capitalize(errors.status.message)
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

                        {invoiceItems.map((invoiceItem, index) => {
                            return (
                                <PartialInvoiceItemForm
                                    key={invoiceItem.id}
                                    count={invoiceItems.length}
                                    index={index}
                                    accountId={account.id}
                                    inventory={inventory}
                                    measurementUnits={measurementUnits}
                                    remove={removeInvoiceItem}
                                    recalculateTotals={recalculateTotals}
                                />
                            );
                        })}

                        <Button
                            variant='contained'
                            onClick={() =>
                                appendInvoiceItem(
                                    getInoiceItemsInitial(userId, settings?.salesTax ?? 0)
                                )
                            }
                        >
                            {invoiceItems.length > 0
                                ? capitalize(t('add another invoice item'))
                                : capitalize(t('add invoice item'))}
                        </Button>

                        <Divider />

                        <FormControl>
                            <DateInput
                                label={capitalize(t('latest payment date'))}
                                name='payBy'
                                required
                                control={control as unknown as Control<FieldValues>}
                                helperText={capitalize(
                                    t('enter the date the invoice must be paid by')
                                )}
                            />
                        </FormControl>

                        <FormSelect
                            name='providerPhone'
                            label={capitalize(t('your phone'))}
                            placeholder={capitalize(t('select your phone'))}
                            control={control as unknown as Control<FieldValues>}
                            required
                            startAdornment={<PhoneIcon />}
                            error={!!errors.providerPhone}
                            helperText={
                                !!errors.providerPhone?.message &&
                                capitalize(errors.providerPhone.message)
                            }
                        >
                            <MenuItem disabled>{capitalize(t('select your phone'))}</MenuItem>
                            {providerPhones.map((phone) => {
                                return (
                                    <MenuItem
                                        key={phone.id}
                                        value={`+${phone.countryCode}-${phone.number}`}
                                    >
                                        <Box
                                            sx={{
                                                marginLeft: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5
                                            }}
                                        >
                                            +{phone.countryCode}-{phone.number}
                                            <Box
                                                component='span'
                                                sx={{
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                ({t(phone.type as TSingleTranslationKey)})
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                        </FormSelect>
                        <FormSelect
                            name='providerEmail'
                            label={capitalize(t('your email'))}
                            placeholder={capitalize(t('select your email'))}
                            control={control as unknown as Control<FieldValues>}
                            required
                            startAdornment={<EmailIcon />}
                            error={!!errors.providerEmail}
                            helperText={
                                !!errors.providerEmail?.message &&
                                capitalize(errors.providerEmail.message)
                            }
                        >
                            <MenuItem disabled>{capitalize(t('select your email'))}</MenuItem>
                            {providerEmails.map((email) => {
                                return (
                                    <MenuItem key={email.id} value={email.email}>
                                        <Tooltip title={capitalize(t('click to see more filters'))}>
                                            <Box
                                                sx={{
                                                    marginLeft: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                {email.email}
                                                <Box
                                                    component='span'
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    ({t(email.type as TSingleTranslationKey)})
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    </MenuItem>
                                );
                            })}
                        </FormSelect>
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
                                    !!errors.paymentInfo?.message &&
                                    capitalize(errors.paymentInfo.message)
                                }
                                {...register('paymentInfo')}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                multiline
                                minRows={2}
                                maxRows={5}
                                label={capitalize(t('payment terms'))}
                                variant='outlined'
                                placeholder={capitalize(t('enter payment terms'))}
                                error={!!errors.additionalInformation}
                                helperText={
                                    !!errors.additionalInformation?.message &&
                                    capitalize(errors.additionalInformation.message)
                                }
                                {...register('paymentTerms')}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                multiline
                                minRows={2}
                                maxRows={5}
                                label={capitalize(t('delivery terms'))}
                                variant='outlined'
                                placeholder={capitalize(t('delivery terms'))}
                                error={!!errors.deliveryTerms}
                                helperText={
                                    !!errors.deliveryTerms?.message &&
                                    capitalize(errors.deliveryTerms.message)
                                }
                                {...register('deliveryTerms')}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                multiline
                                minRows={2}
                                maxRows={5}
                                label={capitalize(t('terms'))}
                                variant='outlined'
                                placeholder={capitalize(t('enter additional terms'))}
                                error={!!errors.terms}
                                helperText={
                                    !!errors.terms?.message && capitalize(errors.terms.message)
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
                                    !!errors.additionalInformation?.message &&
                                    capitalize(errors.additionalInformation.message)
                                }
                                {...register('additionalInformation')}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label={capitalize(t('provider reference'))}
                                variant='outlined'
                                placeholder={capitalize(t('provider reference for this invoice'))}
                                {...register('providerRef')}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label={capitalize(t('customer reference'))}
                                variant='outlined'
                                placeholder={capitalize(t('customer reference for this invoice'))}
                                {...register('customerRef')}
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
                                                return value.map(
                                                    (option: string, index: number) => {
                                                        const { key, ...tagProps } = getTagProps({
                                                            index
                                                        });
                                                        return (
                                                            <Chip
                                                                key={key}
                                                                variant='outlined'
                                                                label={option}
                                                                {...tagProps}
                                                            />
                                                        );
                                                    }
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={!!errors.purchaseOrderNumbers}
                                                    helperText={
                                                        !!errors.purchaseOrderNumbers?.message
                                                            ? capitalize(
                                                                  errors.purchaseOrderNumbers
                                                                      .message
                                                              )
                                                            : capitalize(
                                                                  t('enter text and click enter')
                                                              )
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
                                                return value.map(
                                                    (option: string, index: number) => {
                                                        const { key, ...tagProps } = getTagProps({
                                                            index
                                                        });
                                                        return (
                                                            <Chip
                                                                key={key}
                                                                variant='outlined'
                                                                label={option}
                                                                {...tagProps}
                                                            />
                                                        );
                                                    }
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={!!errors.manufacturerInvoiceNumbers}
                                                    helperText={
                                                        !!errors.manufacturerInvoiceNumbers?.message
                                                            ? capitalize(
                                                                  errors.manufacturerInvoiceNumbers
                                                                      .message
                                                              )
                                                            : capitalize(
                                                                  t('enter text and click enter')
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
                            <DateInput
                                label={capitalize(t('paid on date'))}
                                name='paidOn'
                                control={control as unknown as Control<FieldValues>}
                                helperText={capitalize(
                                    t('enter the date the invoice have been paid on')
                                )}
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
                                error={!!errors.notes}
                                helperText={
                                    !!errors.notes?.message
                                        ? capitalize(errors.notes.message)
                                        : capitalize(t('your internal notes'))
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
                                {capitalize(t(isEdit ? 'update invoice' : 'create invoice'))}
                            </Button>
                        </Box>
                    </StyledForm>
                </LocalizationProvider>
            </FormProvider>
        </>
    );
};

export default InvoiceForm;
