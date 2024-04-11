'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledSectionBox = styled(Box, {
    name: 'Main',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;
