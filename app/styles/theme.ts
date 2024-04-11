import { colors } from './colors';
import { roboto } from './fonts';

declare module '@mui/material/styles' {
    interface Components {
        MainMenuFrameComponent: unknown;
        GameButtonComponent: unknown;
    }
}

// The theme will be created in the ThemeRegistry.tsx
const theme = {
    palette: {
        primary: {
            main: colors.primary
        },
        secondary: {
            main: colors.secondary
        },
        error: {
            main: colors.error
        }
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: '2.8rem'
        },
        h2: {
            fontSize: '2.5rem'
        },
        h3: {
            fontSize: '2.2rem'
        },
        h4: {
            fontSize: '1.8rem'
        },
        h5: {
            fontSize: '1.5rem'
        },
        body1: {
            fontSize: '1.1rem'
        }
    },

    components: {
        MainMenuFrameComponent: {
            styleOverrides: {
                root: {
                    width: 250,
                    height: 400,
                    border: `12px ${colors.primary}`,
                    borderStyle: 'ridge solid',
                    borderRadius: '36px'
                }
            }
        },
        GameButtonComponent: {
            styleOverrides: {
                root: {
                    width: 200,
                    height: 40,
                    borderTop: `1px solid ${colors.lime_green}`,
                    borderLeft: `1px solid ${colors.lime_green}`,
                    background: colors.secondary,
                    clipPath: `polygon(
                        4% 0,
                        100% 0,
                        100% 80%,
                        94% 100%,
                        0 100%,
                        0 20%
                    )`,
                    '&:hover': {
                        border: 'none',
                        background: colors.primary
                    }
                }
            }
        }
    }
};

export default theme;
