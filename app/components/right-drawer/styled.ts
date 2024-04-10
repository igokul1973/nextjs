'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledRightDrawer = styled(Box, {
    name: 'Styled Right Drawer',
    slot: 'Root'
})`
    padding: 2rem;
    width: 100%;
`;
