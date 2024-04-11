import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';

const LoginButton: FC = () => {
    const { pending } = useFormStatus();
    return (
        <Button
            size='large'
            endIcon={<KeyIcon />}
            aria-disabled={pending}
            variant='contained'
            type='submit'
        >
            Log in
        </Button>
    );
};

export default LoginButton;
