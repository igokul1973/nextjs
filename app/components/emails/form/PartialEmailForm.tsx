'use client';

import FormSelect from '@/app/components/form-select/FormSelect';
import { useI18n } from '@/locales/client';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material/utils';
import { FormEventHandler } from 'react';
import { FieldError } from 'react-hook-form';
import { StyledEmailBox, StyledEmailFormBox, StyledMenuItemBox } from './styled';
import { IProps } from './types';

const PartialEmailForm = <T,>({
    register,
    types,
    control,
    errors,
    index,
    count,
    remove
}: IProps<T>) => {
    const t = useI18n();

    const onInvalidEmail: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('please enter the email address')));
    };

    const typeError = errors.emails?.[index]?.type as FieldError;
    const emailError = errors.emails?.[index]?.email;

    return (
        <StyledEmailFormBox>
            <Box>
                <FormSelect
                    fullWidth
                    name={`emails.${index}.type`}
                    label={capitalize(t('type'))}
                    autoComplete='email-type'
                    control={control}
                    required
                    error={!!typeError}
                    helperText={!!typeError?.message && capitalize(typeError.message)}
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
            <StyledEmailBox>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('email'))}
                        autoComplete='email'
                        inputProps={{
                            type: 'email',
                            inputMode: 'email',
                            maxLength: 50,
                            minLength: 5
                        }}
                        variant='outlined'
                        required
                        error={!!emailError}
                        onInvalid={onInvalidEmail}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={!!emailError?.message && capitalize(emailError.message)}
                        {...register(`emails.${index}.email`)}
                    />
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
                </FormControl>
            </StyledEmailBox>
        </StyledEmailFormBox>
    );
};

export default PartialEmailForm;
