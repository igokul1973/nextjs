'use client';

import { StyledBox } from '@/app/[locale]/dashboard/inventory/create/styled';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createCustomer, updateCustomer } from '@/app/lib/data/customer';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, TextField, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import FormSelect from '../../form-select/FormSelect';
import {
    individualCreateSchema,
    individualUpdateSchema
} from '../../individuals/create-form/formSchema';
import { TIndividualForm } from '../../individuals/create-form/types';
import { getDefaultFormValues } from '../utils';
import { StyledForm, StyledMenuItemBox } from './styled';
import { IProps } from './types';

const InventoryForm: FC<IProps> = ({ types, form }) => {
    const t = useI18n();

    const { openSnackbar } = useSnackbar();
    const { user, account } = useUser();
    const userId = user.id;
    const accountId = account.id;
    const { push } = useRouter();

    const {
        // watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        control
    } = useForm({
        resolver: zodResolver(form ? individualUpdateSchema : individualCreateSchema),
        reValidateMode: 'onBlur',
        defaultValues: form || getDefaultFormValues(accountId, userId)
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    const onSubmit = async (formData: TIndividualForm) => {
        try {
            if (formData.id) {
                await updateCustomer(formData, dirtyFields, userId);
                openSnackbar('Successfully update customer.');
            } else {
                await createCustomer(formData);
                openSnackbar('Successfully created customer.');
            }
            push('/dashboard/customers');
        } catch (error) {
            openSnackbar(`Failed to create customer: ${error}`, 'error');
        }
    };

    const isSubmittable = !!isDirty;

    const onInvalidPrice: FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement;
        target.setCustomValidity(capitalize(t('please enter the price')));
    };

    return (
        <StyledBox component='section'>
            {/* Inventory Name */}
            <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormControl>
                    <TextField
                        label={capitalize(t('name'))}
                        placeholder={capitalize(t('name'))}
                        variant='outlined'
                        error={!!errors.name}
                        required
                        helperText={
                            !!errors.name &&
                            capitalize(t(errors.name?.message as TSingleTranslationKeys))
                        }
                        {...register('name')}
                    />
                </FormControl>
                <FormSelect
                    fullWidth
                    name={`type`}
                    label={capitalize(t('type'))}
                    placeholder={capitalize(t('select type'))}
                    control={control}
                    required
                    error={!!errors.typeId}
                    helperText={
                        !!errors.typeId &&
                        capitalize(t(errors.typeId.message as TSingleTranslationKeys))
                    }
                >
                    {types.map((type) => {
                        return (
                            <MenuItem key={type.id} value={type.id}>
                                <StyledMenuItemBox>{capitalize(t(type.type))}</StyledMenuItemBox>
                            </MenuItem>
                        );
                    })}
                </FormSelect>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('price'))}
                        inputProps={{
                            type: 'number',
                            inputMode: 'numeric',
                            minLength: 1
                        }}
                        variant='outlined'
                        required
                        error={!!errors.price}
                        onInvalid={onInvalidPrice}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={
                            !!errors.price &&
                            capitalize(t(errors.price.message as TSingleTranslationKeys))
                        }
                        {...register('price')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        label={capitalize(t('description'))}
                        placeholder={capitalize(t('description'))}
                        variant='outlined'
                        {...register('description')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('external code'))}
                        variant='outlined'
                        placeholder={capitalize(t('external code'))}
                        error={!!errors.externalCode}
                        helperText={
                            !!errors.externalCode &&
                            capitalize(t(errors.externalCode?.message as TSingleTranslationKeys))
                        }
                        {...register('externalCode')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('internal code'))}
                        variant='outlined'
                        placeholder={capitalize(t('internal code'))}
                        error={!!errors.internalCode}
                        helperText={
                            !!errors.internalCode &&
                            capitalize(t(errors.internalCode?.message as TSingleTranslationKeys))
                        }
                        {...register('internalCode')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('manufacturer code'))}
                        variant='outlined'
                        placeholder={capitalize(t('manufacturer code'))}
                        error={!!errors.manufacturerCode}
                        helperText={
                            !!errors.manufacturerCode &&
                            capitalize(
                                t(errors.manufacturerCode?.message as TSingleTranslationKeys)
                            )
                        }
                        {...register('manufacturerCode')}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        label={capitalize(t('manufacturer price'))}
                        inputProps={{
                            type: 'number',
                            inputMode: 'numeric',
                            minLength: 1
                        }}
                        variant='outlined'
                        error={!!errors.manufacturerPrice}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        helperText={
                            !!errors.manufacturerPrice &&
                            capitalize(
                                t(errors.manufacturerPrice.message as TSingleTranslationKeys)
                            )
                        }
                        {...register('manufacturerPrice')}
                    />
                </FormControl>
                <Box className='action-buttons'>
                    <Button
                        component={NextLink}
                        href='/dashboard/inventory'
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
                        {capitalize(t(form ? 'update inventory item' : 'create inventory item'))}
                    </Button>
                </Box>
            </StyledForm>
        </StyledBox>
    );
};

export default InventoryForm;
