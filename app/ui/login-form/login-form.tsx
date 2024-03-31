'use client';

import AlternateEmailOutlined from '@mui/icons-material/AlternateEmailOutlined';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { authenticate } from '../../lib/actions';
import { LoginButton } from './login-button';
import styles from './login-form.module.scss';

export default function LoginForm() {
    const [errorMessage, formAction] = useFormState(authenticate, undefined);

    useEffect(() => {
        const f = async () => {
            const res = await fetch('/api/hello', { method: 'get' });
            const data = await res.json();
            console.log('The returned message: ', data);
        };
        f();
    }, []);

    return (
        <form action={formAction} className={styles.form}>
            <h1>Please log in to continue</h1>
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
