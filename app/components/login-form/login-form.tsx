'use client';

import { authenticate } from '@/app/lib/data/users';
import AlternateEmailOutlined from '@mui/icons-material/AlternateEmailOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import { InputAdornment, Typography, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useContext } from 'react';
import { useFormState } from 'react-dom';
import ColorModeContext from '../theme-registry/ColorModeContext';
import { LoginButton } from './login-button';
import styles from './login-form.module.scss';

export default function LoginForm() {
    const [errorMessage, formAction] = useFormState(authenticate, undefined);
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);

    return (
        <form action={formAction} className={styles.form}>
            <Typography variant='h4'>Please log in to continue</Typography>

            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <div className={styles.fields}>
                <TextField
                    label='Email'
                    id='email'
                    className={styles['full-width']}
                    type='email'
                    name='email'
                    placeholder='Enter your email address'
                    required
                    inputProps={{ minLength: 6 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <AlternateEmailOutlined />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label='Password'
                    id='password'
                    type='password'
                    name='password'
                    placeholder='Enter password'
                    required
                    inputProps={{ minLength: 6 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <AlternateEmailOutlined />
                            </InputAdornment>
                        )
                    }}
                />
            </div>
            <LoginButton />
            <div className={styles.invalid}>
                {errorMessage && (
                    <>
                        <ErrorOutlineOutlined />
                        <p>{errorMessage}</p>
                    </>
                )}
            </div>
        </form>
    );
}
