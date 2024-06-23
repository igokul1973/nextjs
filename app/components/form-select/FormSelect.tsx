import { BaseTextFieldProps, InputBaseProps, InputLabel } from '@mui/material';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { BaseSelectProps } from '@mui/material/Select';
import { FC, PropsWithChildren } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';

const FormSelect: FC<
    BaseTextFieldProps &
        InputBaseProps &
        FormControlProps &
        UseControllerProps &
        PropsWithChildren &
        BaseSelectProps
> = ({
    onChange: onExternalChange,
    name,
    label,
    control,
    defaultValue,
    error,
    helperText,
    children,
    startAdornment,
    ...props
}) => {
    const labelId = `${name}-label`;

    return (
        <FormControl {...props}>
            {label && <InputLabel id={labelId}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, ...field } }) => (
                    <Select
                        onChange={(e) => {
                            if (onExternalChange) {
                                onExternalChange(e.target.value);
                            }
                            onChange(e.target.value);
                        }}
                        labelId={labelId}
                        label={label}
                        error={error}
                        startAdornment={startAdornment}
                        {...field}
                    >
                        {children}
                    </Select>
                )}
            />

            {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default FormSelect;
