'use client';

import BaseFormActionButton from '@/app/components/buttons/base/BaseFormActionButton';
import BaseLinkButton from '@/app/components/buttons/base/BaseLinkButton';
import { colors } from '@/app/styles/colors';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';

export const ContainerBox = styled(Box, {
    name: 'Container Box',
    slot: 'Root'
})`
    background-image: url(/images/background.jpg);
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    display: flex;
    justify-content: center;
    color: ${colors.blue};

    .headline-wrapper {
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(7px);
        width: 70%;
        height: 100%;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            position: relative;
        }

        .form-wrapper {
            padding: 0 2rem;
        }
    }
`;

export const FormWrapperBox = styled(Box, {
    name: 'Form Wrapper Box',
    slot: 'Root'
})`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
`;

export const ButtonsBox = styled(Box, {
    name: 'Buttons Box',
    slot: 'Root'
})`
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    & > :last-child {
        margin-left: auto;
    }
`;

export const StyledLinkButton = styled(BaseLinkButton, {
    name: 'Styled Link Button',
    slot: 'Root'
})`
    min-width: 120px;
`;

export const StyledFormActionButton = styled(BaseFormActionButton, {
    name: 'Styled Link Button',
    slot: 'Root'
})`
    min-width: 120px;
`;
