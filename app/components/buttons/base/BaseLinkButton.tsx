'use client';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import NextLink from 'next/link';
import { useState } from 'react';
import { IBaseLinkButtonProps } from '../types';

export default function BaseLinkButton({
    href,
    name,
    endIcon,
    color = 'primary',
    variant = 'contained',
    ...rest
}: IBaseLinkButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button
            component={NextLink}
            href={href}
            variant={variant}
            color={color}
            endIcon={endIcon}
            onClick={() => {
                setIsLoading(true);
            }}
            {...rest}
        >
            {name}
            {isLoading && <CircularProgress color='inherit' size={16} sx={{ ml: 1 }} />}
        </Button>
    );
}
