'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledProviderContainer = styled(Box, {
    name: 'Styled Provider Container',
    slot: 'Root'
})`
    display: grid;
    grid-auto-rows: min-content;
    gap: 2rem;
`;

export const StyledForm = styled('form', {
    name: 'Styled Form',
    slot: 'Root'
})`
    display: grid;
    gap: 1rem;
`;
