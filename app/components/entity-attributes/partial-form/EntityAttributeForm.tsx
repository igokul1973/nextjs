'use client';

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
import FormSelect from '../../form-select/FormSelect';
import { StyledAttributeValueBox, StyledEntityAttributeBox, StyledMenuItemBox } from './styled';
import { AttributeTypeEnum, IProps } from './types';

const PartialAttributeForm = <T,>({ register, control, errors, index, remove }: IProps<T>) => {
    const t = useI18n();

    const types = Object.values(AttributeTypeEnum);

    const onInvalidAttributeName: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('please enter the email address')));
    };

    const onInvalidAttributeValue: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('please enter at least one character')));
    };

    const typeError = errors.attributes && (errors.attributes[index]?.type as FieldError);
    const nameError = errors.attributes && errors.attributes[index]?.name;
    const valueError = errors.attributes && errors.attributes[index]?.value;

    return (
        <StyledEntityAttributeBox>
            <Box>
                <FormSelect
                    fullWidth
                    name={`attributes.${index}.type`}
                    label={capitalize(t('type'))}
                    control={control}
                    required
                    error={!!typeError}
                    helperText={!!typeError?.message && capitalize(typeError.message)}
                >
                    {types.map((type, index) => {
                        return (
                            <MenuItem key={index} value={type}>
                                <StyledMenuItemBox>{capitalize(type)}</StyledMenuItemBox>
                            </MenuItem>
                        );
                    })}
                </FormSelect>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('name'))}
                        inputProps={{
                            type: 'text',
                            inputMode: 'text',
                            maxLength: 50,
                            minLength: 1
                        }}
                        variant='outlined'
                        required
                        error={!!nameError}
                        onInvalid={onInvalidAttributeName}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={!!nameError?.message && capitalize(nameError.message)}
                        {...register(`attributes.${index}.name`)}
                    />
                </FormControl>
            </Box>
            <StyledAttributeValueBox>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('value'))}
                        inputProps={{
                            type: 'text',
                            inputMode: 'text',
                            maxLength: 50,
                            minLength: 1
                        }}
                        variant='outlined'
                        required
                        error={!!valueError}
                        onInvalid={onInvalidAttributeValue}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={!!valueError?.message && capitalize(valueError.message)}
                        {...register(`attributes.${index}.value`)}
                    />
                </FormControl>
                <IconButton
                    onClick={() => remove(index)}
                    className='delete-btn'
                    aria-label='delete'
                    color='error'
                >
                    <DeleteIcon />
                </IconButton>
            </StyledAttributeValueBox>
        </StyledEntityAttributeBox>
    );
};

export default PartialAttributeForm;
