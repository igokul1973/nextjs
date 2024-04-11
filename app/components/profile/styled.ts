'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledProfileAttribute = styled(Box, {
    name: 'Styled Profile Attribute',
    slot: 'Root'
})`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`;
