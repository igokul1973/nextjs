'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledBox = styled(Box, {
    name: 'Main',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .tools {
        display: flex;
        justify-content: space-between;
    }
`;

export const StyledHeader = styled(Box, {
    name: 'Styled Header',
    slot: 'Root'
})`
    display: flex;
    flex-wrap: 'wrap';
    justify-content: space-between;
`;
