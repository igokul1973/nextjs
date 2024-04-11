'use client';

import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export const StyledCloseButton = styled(IconButton, {
    name: 'StyledCloseButton',
    slot: 'Root'
})`
    transform: scale(1.5);
    color: lightgray;

    &:hover {
        color: gray;
        transform: scale(1.7);
    }
`;
