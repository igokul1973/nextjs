'use client';

import ColorModeContext from '@/app/context/color-mode/provider';
import { authenticate } from '@/app/lib/data/user';
import AlternateEmailOutlined from '@mui/icons-material/AlternateEmailOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import { InputAdornment, Typography, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { FC, useContext } from 'react';
import { useFormState } from 'react-dom';
import LoginButton from './LoginButton';
import { StyledErrorMessage, StyledFields, StyledForm } from './styled';

const LoginForm: FC = () => {
    const [errorMessage, formAction] = useFormState(authenticate, undefined);
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);

    return (
        <StyledForm action={formAction}>
            <Typography variant='h4'>Please log in to continue</Typography>

            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <StyledFields>
                <TextField
                    sx={{ width: '100%' }}
                    label='Email'
                    id='email'
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
            </StyledFields>
            <LoginButton />
            <StyledErrorMessage>
                {errorMessage && (
                    <>
                        <ErrorOutlineOutlined />
                        <p>{errorMessage}</p>
                    </>
                )}
            </StyledErrorMessage>
        </StyledForm>
    );
};

export default LoginForm;
