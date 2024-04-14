'use client';

import { useI18n } from '@/locales/client';
import { TTranslationKeys } from '@/locales/types';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material/utils';
import { FC, FormEventHandler } from 'react';
import FormSelect from '../../form-select/FormSelect';
import { StyledBox } from './styled';
import { IProps } from './types';
import { FieldError } from 'react-hook-form';

const PartialPhoneForm: FC<IProps> = ({ register, types, control, errors, index }) => {
    const t = useI18n();

    const onInvalidCountryCode: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('must be up to 3 digits')));
    };

    const onCountryCodeInput = (e) => {
        const target = e.target as HTMLInputElement;
        target.setCustomValidity('');
        if (target.value.startsWith('+')) target.value = target.value.slice(1);
        target.value = target.value !== '' ? `+${target.value}` : target.value;
    };

    const onInvalidNumber: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('please enter the phone number')));
    };

    const typeError = errors.phones && (errors.phones[index]?.type as FieldError);
    const countryCodeError = errors.phones && errors.phones[index]?.countryCode;
    const numberError = errors.phones && errors.phones[index]?.number;

    return (
        <StyledBox>
            <Box>
                <FormSelect
                    fullWidth
                    name={`phones.${index}.type`}
                    label={capitalize(t('type'))}
                    autoComplete='phone-type'
                    control={control}
                    defaultValue={types[0]}
                    required
                    error={!!typeError}
                    helperText={!!typeError && capitalize(t(typeError.message as TTranslationKeys))}
                >
                    {types.map((type, index) => {
                        return (
                            <MenuItem key={index} value={type}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {capitalize(type)}
                                </Box>
                            </MenuItem>
                        );
                    })}
                </FormSelect>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <TextField
                        sx={{ overflowX: 'clip' }}
                        title={capitalize(t('must be up to 3 digits'))}
                        label={capitalize(t('country code'))}
                        autoComplete='tel-country-code'
                        inputProps={{
                            type: 'tel',
                            inputMode: 'numeric',
                            maxLength: 4
                        }}
                        variant='outlined'
                        // required
                        onInvalid={onInvalidCountryCode}
                        onInput={onCountryCodeInput}
                        error={!!countryCodeError}
                        helperText={
                            !!countryCodeError &&
                            capitalize(t(countryCodeError.message as TTranslationKeys))
                        }
                        {...register(`phones.${index}.countryCode`)}
                    />
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('phones'))}
                        autoComplete='tel-national'
                        inputProps={{
                            type: 'tel',
                            inputMode: 'numeric',
                            maxLength: 14,
                            minLength: 7
                        }}
                        variant='outlined'
                        required
                        error={!!numberError}
                        onInvalid={onInvalidNumber}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={
                            !!numberError && capitalize(t(numberError.message as TTranslationKeys))
                        }
                        {...register(`phones.${index}.number`)}
                    />
                </FormControl>
            </Box>
        </StyledBox>
    );
};

export default PartialPhoneForm;
