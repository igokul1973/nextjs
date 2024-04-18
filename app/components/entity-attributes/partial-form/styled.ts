import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const StyledEntityAttributeBox = styled(Box, {
    name: 'Styled Entity Attribute Box',
    slot: 'Root'
})`
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.5rem;
    row-gap: 1rem;

    & > :first-child {
        flex: 1 0 100px;
    }

    & > :nth-child(2) {
        flex: 1 0 150px;
    }

    & > :last-child {
        flex: 1 0 250px;
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

export const StyledAttributeValueBox = styled(Box, {
    name: 'Styled Attribute Value Box',
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
