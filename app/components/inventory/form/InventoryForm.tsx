'use client';

import { StyledBox } from '@/app/[locale]/dashboard/inventory/create/styled';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createInventoryItem, updateInventoryItem } from '@/app/lib/data/inventory';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, TextField, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import FormSelect from '../../form-select/FormSelect';
import { TIndividualForm } from '../../individuals/form/types';
import { getDefaultFormValues } from '../utils';
import { inventoryCreateSchema, inventoryUpdateSchema } from './formSchema';
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
        resolver: zodResolver(form ? inventoryUpdateSchema : inventoryCreateSchema),
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
            console.log('FormData:', formData);
            if (formData.id) {
                await updateInventoryItem(formData, dirtyFields, userId);
                openSnackbar('Successfully updated inventory item.');
            } else {
                await createInventoryItem(formData);
                openSnackbar('Successfully created inventory item.');
            }
            push('/dashboard/inventory');
        } catch (error) {
            openSnackbar(`Failed to create customer: ${error}`, 'error');
        }
    };

    const isSubmittable = !!isDirty;

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
                    name={'typeId'}
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
                            minLength: 1,
                            step: '0.01'
                        }}
                        variant='outlined'
                        required
                        error={!!errors.price}
                        helperText={
                            !!errors.price &&
                            capitalize(t(errors.price.message as TSingleTranslationKeys))
                        }
                        {...register('price', {
                            onChange: (e) => {
                                const { value } = e.target as HTMLInputElement;
                                // Masking the price to max 2 decimal places
                                const isMatch = value.match(/(\d+\.\d{3,})/g);
                                if (isMatch) {
                                    e.target.value = value.slice(0, -1);
                                }
                            }
                        })}
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
                        label={capitalize(t('manufacturerPrice'))}
                        inputProps={{
                            type: 'number',
                            inputMode: 'numeric',
                            minLength: 1,
                            step: '0.01'
                        }}
                        variant='outlined'
                        required
                        error={!!errors.manufacturerPrice}
                        helperText={
                            !!errors.manufacturerPrice &&
                            capitalize(
                                t(errors.manufacturerPrice.message as TSingleTranslationKeys)
                            )
                        }
                        {...register('manufacturerPrice', {
                            onChange: (e) => {
                                const { value } = e.target as HTMLInputElement;
                                // Masking the manufacturerPrice to max 2 decimal places
                                const isMatch = value.match(/(\d+\.\d{3,})/g);
                                if (isMatch) {
                                    e.target.value = value.slice(0, -1);
                                }
                            }
                        })}
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
