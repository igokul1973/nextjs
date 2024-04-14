import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledBox = styled(Box, {
    name: 'StyledBox',
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
