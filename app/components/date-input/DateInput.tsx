import { useI18n } from '@/locales/client';
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
            render={({ field: { value, ...field }, fieldState: { error } }) => {
                return (
                    <DatePicker
                        label={label}
                        format={format}
                        value={dayjs(value)}
                        slotProps={{
                            textField: {
                                required,
                                error: !!error,
                                helperText: !!error
                                    ? capitalize(t(error?.message))
                                    : capitalize(t(helperText)),
                                FormHelperTextProps: {
                                    error: !!error
                                }
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
