'use client';

import { colors } from '@/app/styles/colors';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const ContainerBox = styled(Box, {
    name: 'Container Box',
    slot: 'Root'
})`
    background-image: url(/images/background.jpg);
    width: 100%;
    min-height: 100vh;
    background-repeat: repeat;
    background-size: cover;
    position: relative;
    display: flex;
    justify-content: center;
    color: ${colors.blue};
`;

export const RegistrationHeadline = styled(Box, {
    name: 'Registration Headline',
    slot: 'Root'
})`
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(15px);
    width: 70%;
    min-height: 100vh;
`;

export const RegistrationHeader = styled(Box, {
    name: 'Registration Header',
    slot: 'Root'
})`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    position: relative;
`;

export const FormWrapperBox = styled(Box, {
    name: 'Form Wrapper Box',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0 2rem 1.5rem;
`;
