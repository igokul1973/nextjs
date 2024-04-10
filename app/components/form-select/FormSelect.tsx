import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { FC, PropsWithChildren } from 'react';
import { Controller } from 'react-hook-form';
import { IProps } from './types';

const FormSelect: FC<IProps & PropsWithChildren> = ({
    name,
    label,
    control,
    defaultValue,
    children,
    ...props
}) => {
    const labelId = `${name}-label`;
    return (
        <FormControl {...props}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field }) => (
                    <Select labelId={labelId} label={label} {...field}>
                        {children}
                    </Select>
                )}
            />
        </FormControl>
    );
};

export default FormSelect;
