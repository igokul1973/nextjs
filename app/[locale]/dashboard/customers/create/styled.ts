'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledBox = styled(Box, {
    name: 'Main',
    slot: 'Root'
})`
    display: grid;
    gap: 2rem;
`;
