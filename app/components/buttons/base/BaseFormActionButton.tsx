'use client';

import Button from '@mui/material/Button';
import { IBaseFormActionButtonProps } from '../types';

export default function BaseFormActionButton({
    action,
    name,
    actionArgs,
    endIcon,
    color = 'primary',
    variant = 'contained'
}: IBaseFormActionButtonProps) {
    const actionWithArgs =
        typeof action === 'function' && actionArgs ? action.bind(null, actionArgs) : action;

    return (
        <form action={actionWithArgs}>
            <Button variant={variant} color={color} type='submit' endIcon={endIcon}>
                {name}
            </Button>
        </form>
    );
}
