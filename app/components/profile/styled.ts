'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledProfileWrapper = styled(Box, {
    name: 'Styled Profile',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const StyledProfile = styled(Box, {
    name: 'Styled Profile',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const StyledProfileAttribute = styled(Box, {
    name: 'Styled Profile Attribute',
    slot: 'Root'
})`
    display: flex;
    gap: 1rem;
    align-items: center;
`;
