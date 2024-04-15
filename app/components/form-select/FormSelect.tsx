import { BaseTextFieldProps, InputLabel } from '@mui/material';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { FC, PropsWithChildren } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';

const FormSelect: FC<
    BaseTextFieldProps & FormControlProps & UseControllerProps & PropsWithChildren
> = ({ name, label, control, defaultValue, error, helperText, children, ...props }) => {
    const labelId = `${name}-label`;

    return (
        <FormControl {...props}>
            {label && <InputLabel id={labelId}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field }) => (
                    <Select labelId={labelId} label={label} error={error} {...field}>
                        {children}
                    </Select>
                )}
            />

            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default FormSelect;
