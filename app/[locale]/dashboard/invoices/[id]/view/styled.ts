'use client';

import BaseLinkButton from '@/app/components/buttons/base/BaseLinkButton';
import UpdateButton from '@/app/components/buttons/update/UpdateButton';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledButtonsContainer = styled(Box, {
    name: 'Styled Update Invoice Btn',
    slot: 'Root'
})`
    position: relative;
`;

export const StyledUpdateInvoiceBtn = styled(UpdateButton, {
    name: 'Styled Update Invoice Btn',
    slot: 'Root'
})`
    position: absolute;
    top: -6.5rem;
    right: 0;
`;

export const StyledViewPdfBtn = styled(BaseLinkButton, {
    name: 'Styled View Pdf Btn',
    slot: 'Root'
})`
    position: absolute;
    top: -3rem;
    right: 0;
`;

export const StyledViewHtmlBtn = styled(BaseLinkButton, {
    name: 'Styled View Pdf Btn',
    slot: 'Root'
})`
    position: absolute;
    top: -3rem;
    right: 0;
`;
