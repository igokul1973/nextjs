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

    & > :first-child {
        flex: 1 0 50px;
    }

    & > :last-child {
        flex: 1 0 250px;
    }
`;

export const StyledProfileAttributeAlignTop = styled(Box, {
    name: 'Styled Profile Attribute Align Top',
    slot: 'Root'
})`
    display: flex;
    gap: 1rem;
    align-items: top;

    & > :first-child {
        flex: 1 0 50px;
    }

    & > :last-child {
        flex: 1 0 250px;
    }
`;
