'use client';

import FormSelect from '@/app/components/form-select/FormSelect';
import { maskMax3Digits } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { FieldError } from 'react-hook-form';
import { StyledBox, StyledMenuItemBox, StyledPhoneNumberBox } from './styled';
import { IProps } from './types';

const PartialPhoneForm = <T,>({
    register,
    types,
    control,
    errors,
    index,
    count,
    remove
}: IProps<T>) => {
    const t = useI18n();

    const typeError = errors.phones && (errors.phones[index]?.type as FieldError);
    const countryCodeError = errors.phones?.[index]?.countryCode;
    const numberError = errors.phones?.[index]?.number;

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
                    helperText={
                        !!typeError && capitalize(t(typeError.message as TSingleTranslationKeys))
                    }
                >
                    {types.map((type) => {
                        return (
                            <MenuItem key={type} value={type}>
                                <StyledMenuItemBox>{capitalize(type)}</StyledMenuItemBox>
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
                            type: 'number',
                            inputMode: 'numeric',
                            maxLength: 4
                        }}
                        InputProps={{
                            startAdornment: '+'
                        }}
                        variant='outlined'
                        required
                        error={!!countryCodeError}
                        helperText={
                            !!countryCodeError &&
                            capitalize(t(countryCodeError.message as TSingleTranslationKeys))
                        }
                        {...register(`phones.${index}.countryCode`, {
                            onChange: maskMax3Digits
                        })}
                    />
                </FormControl>
            </Box>
            <StyledPhoneNumberBox>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('phones'))}
                        autoComplete='tel-national'
                        inputProps={{
                            type: 'number',
                            inputMode: 'numeric',
                            maxLength: 14,
                            minLength: 7
                        }}
                        variant='outlined'
                        required
                        error={!!numberError}
                        helperText={
                            !!numberError &&
                            capitalize(t(numberError.message as TSingleTranslationKeys))
                        }
                        {...register(`phones.${index}.number`)}
                    />
                </FormControl>
                {count > 1 && (
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
