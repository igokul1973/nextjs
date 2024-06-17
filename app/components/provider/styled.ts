'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledProviderAttributeLogo = styled(Box, {
    name: 'Styled Account Attribute',
    slot: 'Root'
})`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    & div: {
        border: 1px solid gray;
    }
`;

export const StyledProviderAttribute = styled(Box, {
    name: 'Styled Provider Attribute',
    slot: 'Root'
})`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`;
