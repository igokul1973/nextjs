'use client';

import FormSelect from '@/app/components/form-select/FormSelect';
import { useI18n } from '@/locales/client';
import { TTranslationKeys } from '@/locales/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { FormEvent, FormEventHandler } from 'react';
import { FieldError } from 'react-hook-form';
import { StyledBox, StyledPhoneNumberBox } from './styled';
import { IProps } from './types';

const PartialPhoneForm = <T,>({ register, types, control, errors, index, remove }: IProps<T>) => {
    const t = useI18n();

    const onInvalidCountryCode: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('must be up to digits', { count: 3 })));
    };

    const onCountryCodeInput = (e: FormEvent<HTMLInputElement>) => {
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
                        title={capitalize(t('must be up to digits', { count: 3 }))}
                        label={capitalize(t('country code'))}
                        autoComplete='tel-country-code'
                        inputProps={{
                            type: 'tel',
                            inputMode: 'numeric',
                            maxLength: 4
                        }}
                        variant='outlined'
                        required
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
            <StyledPhoneNumberBox>
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
                {index > 0 && (
                    <IconButton
                        onClick={() => remove(index)}
                        className='delete-btn'
                        aria-label='delete'
                        color='error'
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </StyledPhoneNumberBox>
        </StyledBox>
    );
};

export default PartialPhoneForm;
