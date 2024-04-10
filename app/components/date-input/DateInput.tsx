import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { BaseNonStaticPickerProps } from '@mui/x-date-pickers/internals';
import { Dayjs } from 'dayjs';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

interface IProps {
    name: string;
    label: string;
    control: Control;
    placeholder: string;
}

const DateInput: FC<IProps & BaseNonStaticPickerProps & DatePickerProps<Dayjs, boolean>> = ({
    name,
    label,
    control,
    placeholder,
    format,
    slotProps
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
                <DatePicker
                    label={label}
                    format={format}
                    onChange={(event) => {
                        onChange(event);
                    }}
                    slotProps={
                        slotProps || {
                            textField: {
                                placeholder,
                                error: !!error,
                                helperText: error?.message
                            }
                        }
                    }
                />
            )}
        />
    );
};

export default DateInput;
