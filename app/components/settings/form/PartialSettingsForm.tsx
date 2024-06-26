'use client';

import FormSelect from '@/app/components/form-select/FormSelect';
import { useApp, usePartialApp } from '@/app/context/user/provider';
import { mask3DecimalPlaces, maskPercentage } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import PercentIcon from '@mui/icons-material/Percent';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, FC } from 'react';
import { Control, Controller, FieldValues, useFormContext } from 'react-hook-form';
import { dateFormats } from './constants';
import { TUpdateSettingsForm, TUpdateSettingsFormOutput } from './types';

const PartialSettingsForm: FC = () => {
    const t = useI18n();
    const {
        state: { provider }
    } = usePartialApp();
    const phoneTypes = provider?.phones.map((p) => p.type) ?? [];
    const emailTypes = provider?.emails.map((e) => e.type) ?? [];

    const {
        control,
        register,
        formState: { errors }
    } = useFormContext<TUpdateSettingsForm, unknown, TUpdateSettingsFormOutput>();

    return (
        <>
            <FormSelect
                name='dateFormat'
                label={capitalize(t('date format'))}
                control={control as unknown as Control<FieldValues>}
                required
                error={!!errors.dateFormat}
                helperText={!!errors.dateFormat?.message && capitalize(errors.dateFormat.message)}
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
                    helperText={!!errors.salesTax?.message && capitalize(errors.salesTax.message)}
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
                        !!errors.paymentTerms?.message && capitalize(errors.paymentTerms.message)
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
                        t('check the box if to show only last 4 characters of customer SSN or EIN')
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
        </>
    );
};

export default PartialSettingsForm;
