import { TInvoiceForm } from '@/app/components/invoices/form/types';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { TInventoryTransformed } from '@/app/lib/data/inventory/types';
import { getFilteredMeasurementUnitsByAccount } from '@/app/lib/data/measurement-unit';
import { TMeasurementUnit } from '@/app/lib/types';
import {
    formatCurrency,
    getInvoiceItemSubtotalAfterTax,
    mask2DecimalPlaces,
    mask3DecimalPlaces,
    maskPercentage,
    maskPrice,
    useDebounce
} from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import DeleteIcon from '@mui/icons-material/Delete';
import PercentIcon from '@mui/icons-material/Percent';
import { capitalize } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useParams } from 'next/navigation';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyledBox } from './styled';
import { IProps } from './types';

const PartialInvoiceItemForm: FC<IProps> = ({
    index,
    count,
    accountId,
    inventory: initialInventory,
    measurementUnits: initialMeasurementUnits,
    remove,
    recalculateTotals
}) => {
    const t = useI18n();
    const { locale } = useParams<{ locale: string }>();
    const {
        watch,
        control,
        register,
        setValue,
        formState: { errors }
    } = useFormContext<TInvoiceForm>();

    const [inventory, setInventory] = useState<TInventoryTransformed[]>(initialInventory);
    const [measurementUnits, setMeasurementUnits] =
        useState<TMeasurementUnit[]>(initialMeasurementUnits);
    const [itemSubtotal, setItemSubtotal] = useState('0.00');

    const inventoryItemError = errors.invoiceItems?.[index]?.inventoryItem;
    const measurementUnitError = errors.invoiceItems?.[index]?.measurementUnit;
    const priceError = errors.invoiceItems?.[index]?.price;
    const quantityError = errors.invoiceItems?.[index]?.quantity;
    const discountError = errors.invoiceItems?.[index]?.discount;
    const salesTaxError = errors.invoiceItems?.[index]?.salesTax;

    const priceWatch = watch(`invoiceItems.${index}.price`);
    const quantityWatch = watch(`invoiceItems.${index}.quantity`);
    const discountWatch = watch(`invoiceItems.${index}.discount`);
    const taxWatch = watch(`invoiceItems.${index}.salesTax`);

    useEffect(() => {
        if (priceWatch && quantityWatch) {
            const subtotal = getInvoiceItemSubtotalAfterTax({
                price: priceWatch || 0,
                quantity: quantityWatch || 0,
                discountPercent: discountWatch || 0,
                taxPercent: taxWatch || 0
            });
            setItemSubtotal(formatCurrency(subtotal / 100, locale));
            recalculateTotals();
        } else {
            setItemSubtotal(formatCurrency(0, locale));
        }
    }, [quantityWatch, taxWatch, discountWatch, priceWatch, locale]);

    const getInventory = async (query: string) => {
        if (!query) {
            return setInventory(initialInventory);
        }
        const inventory = await getFilteredInventoryByAccountIdRaw({ accountId, query });
        setInventory(inventory);
    };

    const debouncedHandleGetInventory = useDebounce<string>(getInventory, 300);

    const getMeasurementUnit = async (query: string) => {
        if (!query) {
            return setMeasurementUnits(initialMeasurementUnits);
        }
        const measurementUnits = await getFilteredMeasurementUnitsByAccount({ accountId, query });
        setMeasurementUnits(measurementUnits);
    };

    const debouncedHandleGetMeasurementUnit = useDebounce<string>(getMeasurementUnit, 300);

    const setAdditionalValues = (inventoryItem: TInventoryTransformed | null) => {
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

    const matchInventory = (input: TInventoryTransformed, value: string) => {
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

    const matchMeasurementUnit = (input: TMeasurementUnit, value: string) => {
        const lowerCaseValue = value.toLocaleLowerCase();
        return (
            input.name.toLocaleLowerCase().includes(lowerCaseValue) ||
            input.abbreviation?.toLocaleLowerCase().includes(lowerCaseValue)
        );
    };

    const getInventoryItemErrorMessage = (error: NonNullable<typeof inventoryItemError>) => {
        if ('message' in error) {
            return capitalize(error.message);
        } else if ('id' in error && error.id) {
            return capitalize(error.id.message);
        } else if ('name' in error && error.name) {
            return capitalize(error.name.message);
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
                                            required
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
                        title={
                            capitalize(t('price')) +
                            ' ' +
                            t('can have up to decimal digits', { count: 2 })
                        }
                        label={capitalize(t('price'))}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            type: 'text'
                        }}
                        variant='outlined'
                        required
                        error={!!priceError}
                        helperText={!!priceError?.message && capitalize(priceError.message)}
                        {...register(`invoiceItems.${index}.price`, {
                            onChange: (e) => {
                                maskPrice(e);
                            },
                            setValueAs: (value) => {
                                if (typeof value === 'undefined' || value === null) return value;
                                const e = {
                                    target: { value: value.toString() }
                                } as unknown as ChangeEvent<HTMLInputElement>;
                                maskPrice(e);
                                const floatValue = parseFloat(e.target.value);
                                return Math.floor(floatValue * 100);
                            }
                        })}
                    />
                </FormControl>
            </Box>
            <FormControl fullWidth>
                <TextField
                    title={
                        capitalize(t('quantity')) +
                        ' ' +
                        t('can have up to decimal digits', { count: 3 })
                    }
                    label={capitalize(t('quantity'))}
                    inputProps={{
                        type: 'text'
                    }}
                    variant='outlined'
                    required
                    error={!!quantityError}
                    helperText={!!quantityError && capitalize(quantityError.message)}
                    {...register(`invoiceItems.${index}.quantity`, {
                        onChange: (e) => {
                            mask3DecimalPlaces(e);
                        },
                        setValueAs: (value) => {
                            if (typeof value === 'undefined' || value === null) return value;
                            const e = {
                                target: { value: value.toString() }
                            } as unknown as ChangeEvent<HTMLInputElement>;
                            mask3DecimalPlaces(e);
                            const floatValue = parseFloat(e.target.value);
                            return Math.floor(floatValue * 1000);
                        }
                    })}
                />
            </FormControl>
            <Box>
                <FormControl fullWidth>
                    <Controller
                        name={`invoiceItems.${index}.measurementUnit`}
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => {
                            return (
                                <Autocomplete
                                    value={
                                        value
                                            ? measurementUnits.find((option) => {
                                                  return option.id === value.id;
                                              })
                                            : null
                                    }
                                    options={measurementUnits}
                                    filterOptions={(options, value) => {
                                        return options.filter((option) =>
                                            matchMeasurementUnit(option, value.inputValue)
                                        );
                                    }}
                                    onChange={(_, inventoryItem) => {
                                        onChange(inventoryItem);
                                    }}
                                    onInputChange={(_, value) => {
                                        if (
                                            !value ||
                                            !measurementUnits.find((mu) =>
                                                matchMeasurementUnit(mu, value)
                                            )
                                        ) {
                                            console.log('Getting the measurement unit');
                                            debouncedHandleGetMeasurementUnit(value);
                                        }
                                    }}
                                    getOptionLabel={(option) => {
                                        return option.abbreviation || option.name;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!measurementUnitError}
                                            helperText={
                                                !!measurementUnitError &&
                                                capitalize(measurementUnitError.message)
                                            }
                                            required
                                            title={capitalize(t('unit'))}
                                            label={capitalize(t('unit'))}
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
                        title={capitalize(t('discount'))}
                        label={capitalize(t('discount'))}
                        inputProps={{
                            type: 'text'
                        }}
                        InputProps={{
                            startAdornment: (
                                <PercentIcon
                                    sx={{
                                        color: 'action.active',
                                        fontSize: '1.2rem',
                                        marginRight: 1
                                    }}
                                />
                            )
                        }}
                        variant='outlined'
                        required
                        error={!!discountError}
                        helperText={!!discountError && capitalize(discountError.message)}
                        {...register(`invoiceItems.${index}.discount`, {
                            onChange: (e) => {
                                maskPercentage(e);
                                mask2DecimalPlaces(e);
                            },
                            setValueAs: (value) => {
                                if (typeof value === 'undefined' || value === null) return value;
                                const e = {
                                    target: { value: value.toString() }
                                } as unknown as ChangeEvent<HTMLInputElement>;
                                maskPercentage(e);
                                mask2DecimalPlaces(e);
                                const floatValue = parseFloat(e.target.value);
                                return Math.floor(floatValue * 100);
                            }
                        })}
                    />
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <TextField
                        title={capitalize(t('sales tax'))}
                        label={capitalize(t('sales tax'))}
                        inputProps={{
                            type: 'text'
                        }}
                        InputProps={{
                            startAdornment: (
                                <PercentIcon
                                    sx={{
                                        color: 'action.active',
                                        fontSize: '1.2rem',
                                        marginRight: 1
                                    }}
                                />
                            )
                        }}
                        variant='outlined'
                        required
                        error={!!salesTaxError}
                        helperText={!!salesTaxError && capitalize(salesTaxError.message)}
                        {...register(`invoiceItems.${index}.salesTax`, {
                            onChange: (e) => {
                                maskPercentage(e);
                                mask3DecimalPlaces(e);
                            },
                            // FIXME: Continue here. This method may set the wrong value
                            // because the masking has not happened yet.
                            setValueAs: (value) => {
                                if (typeof value === 'undefined' || value === null) return value;
                                const e = {
                                    target: { value: value.toString() }
                                } as unknown as ChangeEvent<HTMLInputElement>;
                                maskPercentage(e);
                                mask3DecimalPlaces(e);
                                const floatValue = parseFloat(e.target.value);
                                return Math.floor(floatValue * 1000);
                            }
                        })}
                    />
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth>
                    <TextField
                        sx={{ overflowX: 'clip' }}
                        title={capitalize(t('item subtotal'))}
                        label={capitalize(t('item subtotal'))}
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                        disabled
                        value={itemSubtotal}
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
            </Box>
        </StyledBox>
    );
};

export default PartialInvoiceItemForm;
