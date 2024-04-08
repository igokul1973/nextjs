'use client';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import { colors } from '../styles/colors';

export const ContainerBox = styled(Box, {
    name: 'Container Box',
    slot: 'Root'
})`
    display: grid;
    gap: 5rem;

    .main {
        background-image: url(/images/background.jpg);
        width: 100%;
        height: 100vh;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
        display: grid;
        align-content: center;
        color: ${colors.blue};
    }

    .headline-wrapper {
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(7px);
        width: 100%;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            position: relative;
        }

        .nav {
            display: flex;
            gap: 2rem;
            & > * {
                color: ${colors.orange};
                font-weight: bold;
                text-decoration: none;
                text-transform: uppercase;
            }
            align-items: center;
        }
    }

    .headline {
        padding: 2rem;
    }

    .about {
        padding: 2rem;
        display: grid;
        justify-items: center;
        &--steps {
            display: flex;
            gap: 4rem;
            justify-content: space-around;
        }
        gap: 5rem;
    }

    .pricing {
        padding: 2rem;
        display: grid;
        justify-items: center;
        gap: 5rem;
        &--plans {
            display: flex;
            gap: 4rem;
            justify-content: space-around;
        }
    }
`;
