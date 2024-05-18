import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { BaseTextFieldProps, capitalize } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { BaseNonStaticPickerProps } from '@mui/x-date-pickers/internals';
import dayjs, { Dayjs } from 'dayjs';
import { FC } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';

const DateInput: FC<
    BaseTextFieldProps &
        BaseNonStaticPickerProps &
        UseControllerProps &
        DatePickerProps<Dayjs, boolean>
> = ({ name, label, required, control, helperText, format, slotProps }) => {
    const t = useI18n();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, ref, ...field }, fieldState: { error } }) => {
                return (
                    <DatePicker
                        label={label}
                        format={format}
                        value={dayjs(value)}
                        inputRef={ref}
                        slotProps={{
                            textField: {
                                required,
                                error: !!error,
                                helperText: !!error
                                    ? capitalize(t(error?.message as TSingleTranslationKey))
                                    : capitalize(t(helperText as TSingleTranslationKey)),
                                FormHelperTextProps: {
                                    error: !!error
                                },
                                inputRef: ref
                            },
                            ...slotProps
                        }}
                        {...field}
                    />
                );
            }}
        />
    );
};

export default DateInput;
