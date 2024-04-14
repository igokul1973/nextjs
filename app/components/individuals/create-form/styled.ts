'use client';

import { styled } from '@mui/material';

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
