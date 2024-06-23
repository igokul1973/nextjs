import IconButton from '@mui/material/IconButton';
import NextLink from 'next/link';
import { HTMLAttributes } from 'react';
import { IBaseLinkIconButtonProps } from '../types';

export default function BaseLinkIconButton({
    href,
    icon,
    ariaLabel,
    color = 'primary',
    ...props
}: Readonly<IBaseLinkIconButtonProps & { title: HTMLAttributes<HTMLButtonElement>['title'] }>) {
    const Icon = icon;
    return (
        <IconButton
            component={NextLink}
            href={href}
            color={color}
            aria-label={ariaLabel}
            {...props}
        >
            <Icon />
        </IconButton>
    );
}
