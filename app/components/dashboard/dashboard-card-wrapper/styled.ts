'use client';

import { styled } from '@mui/material';

import Box from '@mui/material/Box';

export const StyledCardWrapper = styled(Box)`
    display: grid;
    gap: 1rem;

    @media screen and (min-width: 576px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;
