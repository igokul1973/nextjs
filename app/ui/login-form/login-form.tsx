'use client';

import AlternateEmailOutlined from '@mui/icons-material/AlternateEmailOutlined';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import KeyIcon from '@mui/icons-material/Key';
import { FormGroup, FormLabel, Input } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '../../lib/actions';
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
            <div>
                <h1>Please log in to continue</h1>
                <div>
                    <div>
                        <FormGroup>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <Input
                                id='email'
                                type='email'
                                name='email'
                                placeholder='Enter your email address'
                                required
                            />
                            <AlternateEmailOutlined />
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup>
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            <Input
                                id='password'
                                type='password'
                                name='password'
                                placeholder='Enter password'
                                required
                                inputProps={{ minLength: 6 }}
                            />
                            <AlternateEmailOutlined />
                            <KeyIcon />
                        </FormGroup>
                    </div>
                </div>
                <LoginButton />
                <div>
                    {errorMessage && (
                        <>
                            <ErrorOutlineOutlined />
                            <p>{errorMessage}</p>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button endIcon={<KeyIcon />} aria-disabled={pending} variant='contained'>
            Log in
        </Button>
    );
}
