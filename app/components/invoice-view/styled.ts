import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledInvoice = styled(Box, {
    name: 'Styled Invoice',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    row-gap: 3rem;
    border: 1px solid lightgray;
    min-height: 1000px;
    padding: 5rem;
`;

export const StyledHeader = styled(Box, {
    name: 'Styled Header',
    slot: 'Root'
})`
    display: flex;
    alignitems: center;
    gap: 1rem;
`;

export const StyledInvoiceInfo = styled(Box, {
    name: 'Styled Invoice Info',
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

export const StyledCustomerInfo = styled(Box, {
    name: 'Styled Customer Info',
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
    display: flex;
    alignitems: center;
    gap: 1rem;
`;
