import IconButton from '@mui/material/IconButton';
import NextLink from 'next/link';
import { IBaseLinkIconButtonProps } from '../types';

export default function BaseLinkIconButton({
    href,
    icon,
    ariaLabel,
    color = 'primary'
}: IBaseLinkIconButtonProps) {
    const Icon = icon;
    return (
        <IconButton component={NextLink} href={href} color={color} aria-label={ariaLabel}>
            <Icon />
        </IconButton>
    );
}
