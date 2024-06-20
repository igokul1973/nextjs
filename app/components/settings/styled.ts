'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledSettingsWrapper = styled(Box, {
    name: 'Styled Settings',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const StyledSettings = styled(Box, {
    name: 'Styled Settings',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const StyledSettingsAttribute = styled(Box, {
    name: 'Styled Settings Attribute',
    slot: 'Root'
})`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const StyledSettingsAttributeAlignTop = styled(Box, {
    name: 'Styled Settings Attribute Align Top',
    slot: 'Root'
})`
    display: flex;
    gap: 1rem;
    align-items: top;
`;
