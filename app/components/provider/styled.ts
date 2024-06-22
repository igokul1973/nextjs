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

    & > :first-child {
        flex: 1 0 70px;
    }

    & > :last-child {
        flex: 1 0 200px;
    }
`;

export const StyledProviderAttribute = styled(Box, {
    name: 'Styled Provider Attribute',
    slot: 'Root'
})`
    display: flex;
    gap: 1rem;
    align-items: center;

    & > :first-child {
        flex: 1 0 70px;
    }

    & > :last-child {
        flex: 1 0 200px;
    }
`;
