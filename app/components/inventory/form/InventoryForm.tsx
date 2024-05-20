'use client';

import { StyledBox } from '@/app/[locale]/dashboard/inventory/create/styled';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createInventoryItem, updateInventoryItem } from '@/app/lib/data/inventory';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { anyTrue, maskPrice } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, TextField, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import FormSelect from '../../form-select/FormSelect';
import { inventoryCreateSchema, inventoryUpdateSchema } from './formSchema';
import { StyledForm, StyledMenuItemBox } from './styled';
import { IProps, TInventoryForm, TInventoryFormOutput } from './types';

const InventoryForm: FC<IProps> = ({ types, defaultValues, isEdit }) => {
    const t = useI18n();

    const { openSnackbar } = useSnackbar();
    const {
        state: { user }
    } = useUser();
    const userId = user.id;
    const { push } = useRouter();

    const {
        // watch,
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        control
    } = useForm<TInventoryForm, unknown, TInventoryFormOutput>({
        resolver: zodResolver(isEdit ? inventoryUpdateSchema : inventoryCreateSchema),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onSubmit = async (formData: TInventoryFormOutput) => {
        try {
            if (isEdit) {
                await updateInventoryItem(formData, dirtyFields, userId);
                openSnackbar('Successfully updated inventory item.');
            } else {
                await createInventoryItem(formData);
                openSnackbar('Successfully created inventory item.');
            }
            push('/dashboard/inventory');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(error.message, 'error');
            }
        }
    };

    const isSubmittable = anyTrue(dirtyFields);

    return (
        <StyledBox component='section'>
            {/* Inventory Name */}
            <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <FormControl>
                    <TextField
                        label={capitalize(t('name'))}
                        placeholder={capitalize(t('name'))}
                        variant='outlined'
                        error={!!errors.name}
                        required
                        helperText={
                            !!errors.name &&
                            capitalize(t(errors.name?.message as TSingleTranslationKey))
                        }
                        {...register('name')}
                    />
                </FormControl>
                <FormSelect
                    fullWidth
                    name={'typeId'}
                    label={capitalize(t('type'))}
                    placeholder={capitalize(t('select type'))}
                    control={control as unknown as Control<FieldValues>}
                    required
                    error={!!errors.typeId}
                    helperText={
                        !!errors.typeId &&
                        capitalize(t(errors.typeId.message as TSingleTranslationKey))
                    }
                >
                    {types.map((type) => {
                        return (
                            <MenuItem key={type.id} value={type.id}>
                                <StyledMenuItemBox>
                                    {capitalize(t(type.type as TSingleTranslationKey))}
                                </StyledMenuItemBox>
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
                            capitalize(t(errors.price.message as TSingleTranslationKey))
                        }
                        {...register('price', {
                            valueAsNumber: true,
                            onChange: (e) => {
                                maskPrice(e);
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
                            capitalize(t(errors.externalCode?.message as TSingleTranslationKey))
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
                            capitalize(t(errors.internalCode?.message as TSingleTranslationKey))
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
                            capitalize(t(errors.manufacturerCode?.message as TSingleTranslationKey))
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
                            minLength: 1,
                            step: '0.01'
                        }}
                        variant='outlined'
                        required
                        error={!!errors.manufacturerPrice}
                        helperText={
                            !!errors.manufacturerPrice &&
                            capitalize(t(errors.manufacturerPrice.message as TSingleTranslationKey))
                        }
                        {...register('manufacturerPrice', {
                            valueAsNumber: true,
                            onChange: (e) => {
                                maskPrice(e);
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
                        {capitalize(t(isEdit ? 'update inventory item' : 'create inventory item'))}
                    </Button>
                </Box>
            </StyledForm>
        </StyledBox>
    );
};

export default InventoryForm;
