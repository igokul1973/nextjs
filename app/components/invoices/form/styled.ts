'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const Totals = styled(Box, {
    name: 'Totals',
    slot: 'Root'
})`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-weight: 700;
    position: sticky;
    top: 65px;
    background-color: white;
    padding-block: 1rem;
    z-index: 100;
`;

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
