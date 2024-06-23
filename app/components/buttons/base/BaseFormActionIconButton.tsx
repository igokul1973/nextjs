'use client';

import IconButton from '@mui/material/IconButton';
import { IBaseFormActionIconButtonProps } from '../types';
import { HTMLAttributes } from 'react';

export default function BaseFormActionIconButton({
    action,
    actionArgs,
    icon,
    color = 'primary',
    ariaLabel,
    ...props
}: Readonly<IBaseFormActionIconButtonProps & HTMLAttributes<HTMLButtonElement>>) {
    const actionWithArgs =
        typeof action === 'function' && actionArgs ? action.bind(null, actionArgs) : action;
    const Icon = icon;

    return (
        <form action={actionWithArgs} title='bla'>
            <IconButton color={color} aria-label={ariaLabel} type='submit' {...props}>
                <Icon />
            </IconButton>
        </form>
    );
}
