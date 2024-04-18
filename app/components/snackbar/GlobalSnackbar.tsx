'use client';

import { SnackbarCloseReason } from '@mui/material/Snackbar';

import { SyntheticEvent } from 'react';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { Box, Button } from '@mui/material';
import { StyledAlert, StyledSnackbar, StyledSnackbarContent } from './styled';

const GlobalSnackbar = () => {
    const { isOpen: open, message, severity, closeSnackbar } = useSnackbar();

    const handleClose = (event: SyntheticEvent<unknown> | Event, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        closeSnackbar();
    };

    return (
        <StyledSnackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transitionDuration={{ enter: 500, exit: 1000 }}
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
        >
            {typeof message === 'string' ? (
                <StyledAlert variant='filled' severity={severity || 'success'}>
                    <StyledSnackbarContent
                        message={message}
                        action={<Button onClick={() => closeSnackbar()}>close</Button>}
                    />
                </StyledAlert>
            ) : (
                <Box>{message}</Box>
            )}
        </StyledSnackbar>
    );
};

export default GlobalSnackbar;
