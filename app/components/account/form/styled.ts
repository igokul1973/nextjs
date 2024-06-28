'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledForm = styled('form', {
    name: 'Form',
    slot: 'Root'
})`
    display: grid;
    gap: 1rem;

    .action-buttons {
        display: flex;
        justify-content: end;
        gap: 1rem;
    }
`;

export const ActionButtonsContainer = styled(Box, {
    name: 'Form',
    slot: 'Root'
})`
    display: flex;
    justify-content: end;
    gap: 1rem;
`;
