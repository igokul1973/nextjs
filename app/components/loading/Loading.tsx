import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export default function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}
        >
            <Stack sx={{ color: 'grey.500' }} spacing={2} direction='row'>
                <CircularProgress color='secondary' />
                <CircularProgress color='success' />
                <CircularProgress color='inherit' />
            </Stack>
        </Box>
    );
}
