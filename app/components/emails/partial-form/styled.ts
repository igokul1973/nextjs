import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledEmailFormBox = styled(Box, {
    name: 'Styled Email Form Box',
    slot: 'Root'
})`
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.5rem;
    row-gap: 1rem;

    & > :first-child {
        flex: 1 0 200px;
    }

    & > :last-child {
        flex: 1 0 400px;
    }
`;

export const StyledEmailBox = styled(Box, {
    name: 'Styled Email Box',
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
