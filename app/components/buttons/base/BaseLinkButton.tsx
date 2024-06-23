'use client';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import NextLink from 'next/link';
import { FC, useEffect, useState } from 'react';
import { IBaseLinkButtonProps } from '../types';

const BaseLinkButton: FC<IBaseLinkButtonProps> = ({
    href,
    name,
    endIcon,
    color = 'primary',
    variant = 'contained',
    ...rest
}) => {
    const [isLoading, setIsLoading] = useState(false);

    // Taking care of situations when the redirect did not
    // take place and the isLoading indicator is spinning
    // indefinitely...
    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setIsLoading(false);
            }, 6000);
        }
    }, [isLoading, setIsLoading]);

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
};

export default BaseLinkButton;
