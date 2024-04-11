'use client';

import { styled } from '@mui/material';

export const StyledForm = styled('form', {
    name: 'Form',
    slot: 'Root'
})`
    width: 450px;
    margin: 10rem auto 0;
    display: grid;
    row-gap: 1rem;
`;

export const StyledFields = styled('div', {
    name: 'Styled fields',
    slot: 'Root'
})`
    display: grid;
    row-gap: 2rem;
`;

export const StyledErrorMessage = styled('div', {
    name: 'Styled error message',
    slot: 'Root'
})`
    color: red;
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
`;
