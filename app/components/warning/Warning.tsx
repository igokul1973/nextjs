'use client';

import { TypographyOwnProps } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { StyledWarning } from './styled';

const Warning: FC<TypographyOwnProps & PropsWithChildren> = ({
    variant = 'h5',
    children,
    ...props
}) => {
    return (
        <StyledWarning variant={variant} {...props}>
            {children}
        </StyledWarning>
    );
};

export default Warning;
