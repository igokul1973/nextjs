'use client';

import IconButton from '@mui/material/IconButton';
import { IBaseFormActionIconButtonProps } from '../types';

export default function BaseFormActionIconButton({
    action,
    actionArgs,
    icon,
    color = 'primary',
    ariaLabel
}: IBaseFormActionIconButtonProps) {
    const actionWithArgs =
        typeof action === 'function' && actionArgs ? action.bind(null, actionArgs) : action;
    const Icon = icon;

    return (
        <form action={actionWithArgs}>
            <IconButton color={color} aria-label={ariaLabel} type='submit'>
                <Icon />
            </IconButton>
        </form>
    );
}
