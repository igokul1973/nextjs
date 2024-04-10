'use client';

import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';

export const StyledWarning = styled(Typography, {
    name: 'StyledWarning',
    slot: 'Root'
})`
    color: ${({ theme }) => theme.palette.warning.main};
`;
