'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledForm = styled('form', {
    name: 'Form',
    slot: 'Root'
})`
    display: grid;
    gap: 2rem;

    .action-buttons {
        display: flex;
        justify-content: end;
        gap: 1rem;
    }
`;

export const StyledMenuItemBox = styled(Box, {
    name: 'Styled Menu Item Box',
    slot: 'Root'
})`
    display: flex;
    alignitems: center;
    gap: 1;
`;
