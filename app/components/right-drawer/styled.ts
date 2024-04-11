'use client';

import { styled } from '@mui/material';
import Drawer from '@mui/material/Drawer';

export const StyledRightDrawer = styled(Drawer, {
    name: 'Styled Right Drawer',
    slot: 'Root'
})`
    display: flex;
    padding: 2rem;
    width: 100%;

    .drawer-content {
        padding: 2rem;
        display: grid;
        gap: 1.5rem;
        position: relative;
    }

    .drawer-heading {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .close-button {
        position: absolute;
        top: 2.2rem;
        right: 1.8rem;
    }

    .drawer-title {
        width: 88%;
        overflow: hidden;
    }
`;
