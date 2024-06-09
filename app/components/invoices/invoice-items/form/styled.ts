import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledBox = styled(Box, {
    name: 'StyledBox',
    slot: 'Root'
})`
    display: flex;
    flex-wrap: nowrap;
    column-gap: 0.5rem;
    row-gap: 1rem;

    & > :first-child {
        flex: 1 0 250px;
    }

    & > :nth-child(2) {
        flex: 1 0 100px;
    }

    & > :nth-child(3) {
        flex: 1 0 50px;
    }

    & > :nth-child(4) {
        flex: 1 0 150px;
    }

    & > :nth-child(5) {
        flex: 1 0 70px;
    }

    & > :nth-child(6) {
        flex: 1 0 70px;
    }

    & > :nth-child(7) {
        flex: 0 0 70px;
    }

    & > :last-child {
        flex: 0 1 180px;
        position: relative;

        .delete-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            z-index: 1;
        }
    }
`;

export const StyledMenuItemBox = styled(Box, {
    name: 'Styled Menu Item Box',
    slot: 'Root'
})`
    display: flex;
    alignitems: center;
    gap: 1;
`;
