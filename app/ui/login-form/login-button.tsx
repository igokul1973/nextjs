import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import { useFormStatus } from 'react-dom';

export function LoginButton() {
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
}
