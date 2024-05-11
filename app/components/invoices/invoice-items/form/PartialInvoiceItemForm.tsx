import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { TInventory } from '@/app/lib/types';
import { mask2DecimalPlaces, useDebounce } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { capitalize } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { FC, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TInvoiceForm } from '../../form/types';
import { StyledBox, StyledQuantityBox } from './styled';
import { IProps } from './types';

const PartialInvoiceItemForm: FC<IProps> = ({
    index,
    count,
    accountId,
    inventory: initialInventory,
    remove
}) => {
    const t = useI18n();
    const {
        control,
        register,
        setValue,
        formState: { errors }
    } = useFormContext<TInvoiceForm>();

    const [inventory, setInventory] = useState<TInventory[]>(initialInventory);

    const inventoryItemError = errors.invoiceItems?.[index]?.inventoryItem;
    const priceError = errors.invoiceItems?.[index]?.price;
    const quantityError = errors.invoiceItems?.[index]?.quantity;

    const getInventory = async (filter: string) => {
        if (!filter) {
            return setInventory(initialInventory);
        }
        const inventory = await getFilteredInventoryByAccountIdRaw(accountId, filter);
        setInventory(inventory);
    };

    const debouncedHandleGetInventory = useDebounce<string>(getInventory, 300);

    const setAdditionalValues = (inventoryItem: TInventory | null) => {
        if (inventoryItem) {
            setValue(`invoiceItems.${index}.name`, inventoryItem.name, {
                shouldValidate: true
            });
            setValue(`invoiceItems.${index}.price`, inventoryItem.price, {
                shouldValidate: true
            });
            setValue(`invoiceItems.${index}.inventoryId`, inventoryItem.id, {
                shouldValidate: true
            });
        } else {
            setValue(`invoiceItems.${index}.name`, '', {
                shouldValidate: true
            });
            setValue(`invoiceItems.${index}.price`, null, {
                shouldValidate: true
            });
            setValue(`invoiceItems.${index}.inventoryId`, '', {
                shouldValidate: true
            });
        }
    };

    const matchInventory = (input: TInventory, value: string) => {
        const lowerCaseValue = value.toLocaleLowerCase();
        return (
            input.id === lowerCaseValue ||
            input.name.toLocaleLowerCase().includes(lowerCaseValue) ||
            input.description?.toLocaleLowerCase().includes(lowerCaseValue) ||
            input.internalCode?.toLocaleLowerCase().includes(lowerCaseValue) ||
            input.manufacturerCode?.toLocaleLowerCase().includes(lowerCaseValue) ||
            input.externalCode?.toLocaleLowerCase().includes(lowerCaseValue)
        );
    };

    const getInventoryItemErrorMessage = (error: NonNullable<typeof inventoryItemError>) => {
        if ('message' in error) {
            return capitalize(t(error.message as TSingleTranslationKeys));
        } else if ('id' in error && error.id) {
            return capitalize(t(error.id.message as TSingleTranslationKeys));
        } else if ('name' in error && error.name) {
            return capitalize(t(error.name.message as TSingleTranslationKeys));
        } else {
            return '';
        }
    };

    return (
        <StyledBox>
            <Box>
                <FormControl fullWidth>
                    <Controller
                        name={`invoiceItems.${index}.inventoryItem`}
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => {
                            return (
                                <Autocomplete
                                    value={
                                        value
                                            ? inventory.find((option) => option.id === value.id)
                                            : null
                                    }
                                    options={inventory}
                                    filterOptions={(options, value) => {
                                        return options.filter((option) =>
                                            matchInventory(option, value.inputValue)
                                        );
                                    }}
                                    onChange={(_, inventoryItem) => {
                                        setAdditionalValues(inventoryItem);
                                        onChange(inventoryItem);
                                    }}
                                    onInputChange={(_, value) => {
                                        if (
                                            !value ||
                                            !inventory.find((ii) => matchInventory(ii, value))
                                        ) {
                                            console.log('Getting the inventory');
                                            debouncedHandleGetInventory(value);
                                        }
                                    }}
                                    getOptionLabel={(option) => {
                                        return option.name;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!inventoryItemError}
                                            helperText={
                                                !!inventoryItemError &&
                                                getInventoryItemErrorMessage(inventoryItemError)
                                            }
                                            label={capitalize(t('inventory item name'))}
                                            placeholder={capitalize(t('enter inventory item name'))}
                                            inputRef={field.ref}
                                        />
                                    )}
                                    {...field}
                                />
                            );
                        }}
                    />
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <TextField
                        sx={{ overflowX: 'clip' }}
                        title={capitalize(t('must be up to digits', { count: 3 }))}
                        label={capitalize(t('price'))}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            type: 'number',
                            inputMode: 'decimal'
                        }}
                        variant='outlined'
                        required
                        disabled
                        error={!!priceError}
                        helperText={
                            !!priceError &&
                            capitalize(t(priceError.message as TSingleTranslationKeys))
                        }
                        {...register(`invoiceItems.${index}.price`)}
                    />
                </FormControl>
            </Box>
            <StyledQuantityBox>
                <FormControl fullWidth>
                    <TextField
                        title={capitalize(t('must be up to digits', { count: 3 }))}
                        label={capitalize(t('quantity'))}
                        inputProps={{
                            type: 'number',
                            inputMode: 'decimal',
                            minLength: 1,
                            step: '1'
                        }}
                        variant='outlined'
                        required
                        error={!!quantityError}
                        helperText={
                            !!quantityError &&
                            capitalize(
                                t(quantityError.message as TSingleTranslationKeys, { count: 0 })
                            )
                        }
                        {...register(`invoiceItems.${index}.quantity`, {
                            valueAsNumber: true,
                            onChange: mask2DecimalPlaces
                        })}
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
            </StyledQuantityBox>
        </StyledBox>
    );
};

export default PartialInvoiceItemForm;
