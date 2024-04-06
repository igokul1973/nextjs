import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { IBaseLinkButtonProps } from '../types';

export default function BaseLinkButton({
    href,
    name,
    endIcon,
    color = 'primary',
    variant = 'contained',
    ...rest
}: IBaseLinkButtonProps) {
    return (
        <Button
            component={NextLink}
            href={href}
            variant={variant}
            color={color}
            endIcon={endIcon}
            {...rest}
        >
            {name}
        </Button>
    );
}
