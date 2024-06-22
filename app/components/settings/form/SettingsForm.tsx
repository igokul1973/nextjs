'use client';

import FormSelect from '@/app/components/form-select/FormSelect';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createSettings, updateSettings } from '@/app/lib/data/settings/actions';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TDirtyFields } from '@/app/lib/types';
import { mask3DecimalPlaces, maskPercentage, populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import PercentIcon from '@mui/icons-material/Percent';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, FC, useState } from 'react';
import { Control, Controller, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { dateFormats } from './constants';
import { getSettingsCreateSchema, getSettingsUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { TSettingsForm, TSettingsFormOutput } from './types';
import { getDefaultValues } from './utils';

const SettingsForm: FC = () => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const {
        state: { account, user, settings: rawSettings, provider },
        dispatch: userDispatch
    } = useUser();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();
    const phoneTypes = provider?.phones.map((p) => p.type) ?? [];
    const emailTypes = provider?.emails.map((e) => e.type) ?? [];
    const settings = rawSettings && { ...rawSettings, salesTax: rawSettings.salesTax / 1000 };

    // FIXME: isEdit === true for now...
    const isEdit = true;

    const defaultValues = populateForm<TSettingsForm>(
        getDefaultValues(account.id, user.id),
        settings || {}
    );

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isDirty, ...formState },
        control,
        setValue,
        ...methods
    } = useForm<TSettingsForm, unknown, TSettingsFormOutput>({
        resolver: zodResolver(isEdit ? getSettingsUpdateSchema(t) : getSettingsCreateSchema(t)),
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

    const goBack = () => {
        rightDrawerDispatch({
            payload: { childComponentName: 'settings' },
            type: 'open'
        });
    };

    const onSubmit = async (formData: TSettingsFormOutput) => {
        try {
            if (isEdit) {
                const updatedSettings = await updateSettings(
                    formData,
                    dirtyFields as TDirtyFields<TSettingsFormOutput>
                );

                if (!updatedSettings) {
                    throw Error(t('could not update account settings'));
                }

                userDispatch({ type: 'setSettings', payload: { settings: updatedSettings } });
                openSnackbar(capitalize(t('successfully updated account settings')));

                goBack();
            } else {
                await createSettings(formData);
                openSnackbar(capitalize(t('successfully created account settings')));
            }
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    const isSubmittable = isDirty;

    //   dateFormat                         String        @default("YYYY/MM/DD") @map("date_format") @db.VarChar(12)
    //   providerInvoicePhoneType           PhoneTypeEnum @default(invoicing) @map("provider_invoice_phone_type")
    //   providerInvoiceEmailType           EmailTypeEnum @default(invoicing) @map("provider_invoice_email_type")
    //   paymentInformation                 String        @default("") @map("payment_information") @db.VarChar(255)
    //   paymentTerms                       String        @default("") @map("payment_terms") @db.VarChar(255)
    //   deliveryTerms                      String        @default("") @map("delivery_terms") @db.VarChar(255)
    //   terms                              String        @default("") @db.VarChar(255)
    //   salesTax                           Int           @default(0) @map("sales_tax") @db.Integer
    //   isDisplayCustomerLocalIdentifier   Boolean       @default(false) @map("is_display_customer_local_identifier")
    //   isObfuscateCustomerLocalIdentifier Boolean       @default(true) @map("is_obfuscate_customer_local_identifier")
    //   isDisplayProviderLocalIdentifier   Boolean       @default(false) @map("is_display_provider_local_identifier")
    //   isObfuscateProviderLocalIdentifier Boolean       @default(true) @map("is_obfuscate_provider_local_identifier")

    return (
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
                <FormSelect
                    name='dateFormat'
                    label={capitalize(t('date format'))}
                    control={control as unknown as Control<FieldValues>}
                    required
                    error={!!errors.dateFormat}
                    helperText={
                        !!errors.dateFormat?.message && capitalize(errors.dateFormat.message)
                    }
                >
                    {dateFormats.map((dateFormat) => {
                        return (
                            <MenuItem key={dateFormat} value={dateFormat}>
                                <Box>{dateFormat}</Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>
                <FormSelect
                    name='providerInvoicePhoneType'
                    label={capitalize(t('provider invoice phone type'))}
                    control={control as unknown as Control<FieldValues>}
                    required
                    error={!!errors.providerInvoicePhoneType}
                    helperText={
                        errors.providerInvoicePhoneType?.message
                            ? capitalize(errors.providerInvoicePhoneType.message)
                            : capitalize(t('provide default phone type for new invoices'))
                    }
                >
                    {phoneTypes.map((phoneType) => {
                        return (
                            <MenuItem key={phoneType} value={phoneType}>
                                <Box>{phoneType}</Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>
                <FormSelect
                    name='providerInvoiceEmailType'
                    label={capitalize(t('provider invoice email type'))}
                    control={control as unknown as Control<FieldValues>}
                    required
                    error={!!errors.providerInvoiceEmailType}
                    helperText={
                        errors.providerInvoiceEmailType?.message
                            ? capitalize(errors.providerInvoiceEmailType.message)
                            : capitalize(t('provide default email type for new invoices'))
                    }
                >
                    {emailTypes.map((emailType) => {
                        return (
                            <MenuItem key={emailType} value={emailType}>
                                <Box>{emailType}</Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>
                <FormControl fullWidth>
                    <TextField
                        title={capitalize(t('sales tax'))}
                        label={capitalize(t('sales tax'))}
                        inputProps={{
                            type: 'text'
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
                        error={!!errors.salesTax}
                        helperText={
                            !!errors.salesTax?.message && capitalize(errors.salesTax.message)
                        }
                        {...register('salesTax', {
                            onChange: (e) => {
                                maskPercentage(e);
                                mask3DecimalPlaces(e);
                            },
                            setValueAs: (value) => {
                                if (typeof value === 'undefined' || value === null) return value;
                                const e = {
                                    target: { value: value.toString() }
                                } as unknown as ChangeEvent<HTMLInputElement>;
                                maskPercentage(e);
                                mask3DecimalPlaces(e);
                                const floatValue = parseFloat(e.target.value);
                                return Math.floor(floatValue * 1000);
                            }
                        })}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        label={capitalize(t('payment information'))}
                        placeholder={capitalize(t('payment information'))}
                        variant='outlined'
                        error={!!errors.paymentInformation}
                        required
                        helperText={
                            !!errors.paymentInformation?.message &&
                            capitalize(errors.paymentInformation.message)
                        }
                        {...register('paymentInformation')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('payment terms'))}
                        variant='outlined'
                        placeholder={capitalize(t('payment terms'))}
                        required
                        error={!!errors.paymentTerms}
                        helperText={
                            !!errors.paymentTerms?.message &&
                            capitalize(errors.paymentTerms.message)
                        }
                        {...register('paymentTerms')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('delivery terms'))}
                        placeholder={capitalize(t('delivery terms'))}
                        variant='outlined'
                        {...register('deliveryTerms')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        label={capitalize(t('terms'))}
                        placeholder={capitalize(t('terms'))}
                        variant='outlined'
                        {...register('terms')}
                    />
                </FormControl>
                <FormControl fullWidth={false}>
                    <Tooltip title={capitalize(t('check the box if to show customer SSN or EIN'))}>
                        <FormControlLabel
                            sx={{ alignSelf: 'flex-start' }}
                            label={capitalize(t('display customer local identifier'))}
                            control={
                                <Controller
                                    name='isDisplayCustomerLocalIdentifier'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field: props }) => (
                                        <Checkbox
                                            {...props}
                                            checked={!!props.value}
                                            onChange={(e) => props.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                        />
                    </Tooltip>
                </FormControl>
                <FormControl fullWidth={false}>
                    <Tooltip
                        title={capitalize(
                            t(
                                'check the box if to show only last 4 characters of customer SSN or EIN'
                            )
                        )}
                    >
                        <FormControlLabel
                            sx={{ alignSelf: 'flex-start' }}
                            label={capitalize(t('obfuscate customer local identifier'))}
                            control={
                                <Controller
                                    name='isObfuscateCustomerLocalIdentifier'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field: props }) => (
                                        <Checkbox
                                            {...props}
                                            checked={!!props.value}
                                            onChange={(e) => props.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                        />
                    </Tooltip>
                </FormControl>
                <FormControl fullWidth={false}>
                    <Tooltip title={capitalize(t('check the box if to show your SSN or EIN'))}>
                        <FormControlLabel
                            sx={{ alignSelf: 'flex-start' }}
                            label={capitalize(t('display your local identifier'))}
                            control={
                                <Controller
                                    name='isDisplayProviderLocalIdentifier'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field: props }) => (
                                        <Checkbox
                                            {...props}
                                            checked={!!props.value}
                                            onChange={(e) => props.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                        />
                    </Tooltip>
                </FormControl>
                <FormControl fullWidth={false}>
                    <Tooltip
                        title={capitalize(
                            t('check the box if to show only last 4 characters of your SSN or EIN')
                        )}
                    >
                        <FormControlLabel
                            sx={{ alignSelf: 'flex-start' }}
                            label={capitalize(t('obfuscate your local identifier'))}
                            control={
                                <Controller
                                    name='isObfuscateProviderLocalIdentifier'
                                    control={control}
                                    defaultValue={false}
                                    render={({ field: props }) => (
                                        <Checkbox
                                            {...props}
                                            checked={!!props.value}
                                            onChange={(e) => props.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                        />
                    </Tooltip>
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
                        {capitalize(t(isEdit ? 'update settings' : 'create settings'))}
                    </Button>
                </Box>
            </StyledForm>
        </FormProvider>
    );
};

export default SettingsForm;
