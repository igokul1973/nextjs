import { useI18n } from '@/locales/client';
import { TTranslationKeys } from '@/locales/types';
import { capitalize } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { BaseNonStaticPickerProps } from '@mui/x-date-pickers/internals';
import { Dayjs } from 'dayjs';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { IProps } from './types';

const DateInput: FC<IProps & BaseNonStaticPickerProps & DatePickerProps<Dayjs, boolean>> = ({
    name,
    label,
    control,
    helperText,
    format,
    slotProps
}) => {
    const t = useI18n();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                    <DatePicker
                        label={label}
                        format={format}
                        onChange={(event) => {
                            onChange(event);
                        }}
                        slotProps={
                            slotProps || {
                                textField: {
                                    error: !!error,
                                    helperText:
                                        !!error &&
                                        capitalize(
                                            t(
                                                (error?.message?.toLocaleLowerCase() ||
                                                    helperText) as TTranslationKeys
                                            )
                                        )
                                }
                            }
                        }
                    />
                );
            }}
        />
    );
};

export default DateInput;
