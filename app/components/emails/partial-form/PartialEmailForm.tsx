'use client';

import { useI18n } from '@/locales/client';
import { TTranslationKeys } from '@/locales/types';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material/utils';
import { FC, FormEventHandler } from 'react';
import { FieldError } from 'react-hook-form';
import FormSelect from '../../form-select/FormSelect';
import { StyledBox } from './styled';
import { IProps } from './types';

const PartialEmailForm: FC<IProps> = ({ register, types, control, errors, index }) => {
    const t = useI18n();

    const onInvalidEmail: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('please enter the email address')));
    };

    const typeError = errors.emails && (errors.emails[index]?.type as FieldError);
    const numberError = errors.emails && errors.emails[index]?.email;

    return (
        <StyledBox>
            <Box>
                <FormSelect
                    fullWidth
                    name={`emails.${index}.type`}
                    label={capitalize(t('type'))}
                    autoComplete='email-type'
                    control={control}
                    required
                    error={!!typeError}
                    helperText={
                        !!typeError && capitalize(t(typeError?.message as TTranslationKeys))
                    }
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
                        error={!!numberError}
                        onInvalid={onInvalidEmail}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={
                            !!numberError && capitalize(t(numberError?.message as TTranslationKeys))
                        }
                        {...register(`emails.${index}.email`)}
                    />
                </FormControl>
            </Box>
        </StyledBox>
    );
};

export default PartialEmailForm;
