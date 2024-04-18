'use client';

import { styled } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

export const StyledSnackbar = styled(Snackbar, {
    name: 'Styled Snackbar',
    slot: 'Root'
})`
    font-size: 2rem;
    &.MuiSnackbar-root {
        top: 80px;
    }
    .MuiSnackbarContent-root {
        display: flex;
        font-size: 2rem;
    }
`;

export const StyledAlert = styled(Alert, {
    name: 'Styled Alert',
    slot: 'Root'
})`
    // width: 100%;
    align-items: center;
`;

export const StyledSnackbarContent = styled(SnackbarContent, {
    name: 'Styled Snackbar Content',
    slot: 'Root'
})`
    background-color: transparent;
    box-shadow: none;
    padding: 0;

    &.MuiSnackbarContent-root {
        font-size: 1.2rem;
        color: inherit;
    }

    & button {
        color: inherit;
    }
`;
