'use client';

import { styled } from '@mui/material';

export const StyledPdfViewer = styled('object', {
    name: 'Styled Pdf Viewer',
    slot: 'Root'
})`
    width: 100%;
    height: 80vh;
    border: none;

    @media screen and (min-height: 550px) {
        height: 83vh;
    }

    @media screen and (min-height: 700px) {
        height: 86vh;
    }

    @media screen and (min-height: 900px) {
        height: 90vh;
    }

    @media screen and (min-height: 1150px) {
        height: 92vh;
    }
`;
