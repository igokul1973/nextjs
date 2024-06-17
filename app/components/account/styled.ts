'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledAccountWrapper = styled(Box, {
    name: 'Styled Account',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const StyledAccount = styled(Box, {
    name: 'Styled Account',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const StyledAccountAttribute = styled(Box, {
    name: 'Styled Account Attribute',
    slot: 'Root'
})`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`;
