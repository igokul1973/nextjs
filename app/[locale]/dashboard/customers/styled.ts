'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledBox = styled(Box, {
    name: 'Main',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    .tools {
        display: flex;
        justify-content: space-between;
    }
`;
