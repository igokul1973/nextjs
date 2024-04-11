'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Receipt from '@mui/icons-material/Receipt';

export const StyledLogoWrapper = styled(Box, {
    name: 'Styled Logo Wrapper',
    slot: 'Root'
})`
    width: min-content;
    display: grid;
    grid-template-columns: repeat(2, min-content);
    align-items: center;
    justify-content: center;
`;

export const StyledLogoIcon = styled(Receipt, {
    name: 'Styled Logo Icon',
    slot: 'Root'
})`
    height: 4ch;
    width: 4ch;
`;
