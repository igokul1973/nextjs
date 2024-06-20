'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';

export const StyledInvoice = styled(Box, {
    name: 'Styled Invoice',
    slot: 'Root'
})`
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 4vw;
    border: 1px solid lightgray;
    width: 100%;
    aspect-ratio: 8.286 / 11.693; // letterhead size (for now)
    padding: 6vw;
    font-size: 1.2vw;
    th,
    td {
        padding: 0.5vw;
    }
    h2 {
        font-size: 3vw;
        font-weight: 400;
    }
    h3 {
        font-size: 2.2vw;
    }
    h5 {
        font-size: 1.4vw;
    }
    p {
        font-size: 1.2vw;
    }
`;

export const StyledHeader = styled(Box, {
    name: 'Styled Header',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.2vw;
`;

export const StyledInvoiceInfo = styled(Box, {
    name: 'Styled Invoice Info',
    slot: 'Root'
})`
    position: relative;
    flex: 1;

    .delete-btn {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        z-index: 1;
    }
`;

export const StyledCustomerInfo = styled(Box, {
    name: 'Styled Customer Info',
    slot: 'Root'
})`
    position: relative;
    flex: 1;

    .delete-btn {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        z-index: 1;
    }
`;

export const StyledInvoiceItems = styled(Box, {
    name: 'Styled Invoice Items',
    slot: 'Root'
})`
    position: relative;

    .delete-btn {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        z-index: 1;
    }
`;

export const StyledAdditionalInfo = styled(Box, {
    name: 'Styled Additional Info',
    slot: 'Root'
})`
    position: relative;

    .delete-btn {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        z-index: 1;
    }
`;

export const StyledFooter = styled(Box, {
    name: 'Styled Footer',
    slot: 'Root'
})`
    margin-top: auto;
    padding-top: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    border-top: 1px solid lightgray;
`;

export const StyledTableCell = styled(TableCell, {
    name: 'Styled Footer',
    slot: 'Root'
})`
    font-size: inherit;
    padding: inherit;
`;

export const FlexBox = styled(Box, {
    name: 'Flex Box',
    slot: 'Root'
})`
    display: flex;
    gap: 2rem;
`;
