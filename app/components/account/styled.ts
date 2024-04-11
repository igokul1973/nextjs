'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledAccountAttribute = styled(Box, {
    name: 'Styled Account Attribute',
    slot: 'Root'
})`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`;
