import { ThemeOptions } from '@mui/material';
import { colors } from './colors';
import { roboto } from './fonts';

declare module '@mui/material/styles' {
    interface Components {
        GameButtonComponent?: unknown;
    }
}

// The theme will be created in the ThemeRegistry.tsx
const theme: ThemeOptions = {
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
        MuiAlert: {
            styleOverrides: {
                filledSuccess: {
                    backgroundColor: colors.success,
                    color: 'white',
                    maxWidth: '500px'
                },
                filledError: {
                    backgroundColor: colors.error,
                    color: 'white',
                    maxWidth: '500px'
                },
                filledWarning: {
                    backgroundColor: colors.warning,
                    color: 'red',
                    maxWidth: '500px'
                },
                filledInfo: {
                    backgroundColor: colors.info,
                    color: 'white',
                    maxWidth: '500px'
                },
                standardSuccess: {
                    backgroundColor: colors.success,
                    color: 'white',
                    maxWidth: '500px'
                },
                standardError: {
                    backgroundColor: colors.error,
                    color: 'white',
                    maxWidth: '500px'
                },
                standardWarning: {
                    backgroundColor: colors.warning,
                    color: 'red',
                    maxWidth: '500px'
                },
                standardInfo: {
                    backgroundColor: colors.info,
                    color: 'black',
                    maxWidth: '500px'
                }
            }
        }
        /* Example of a MUI component style overrides */
        // MuiTableCell: {
        //     styleOverrides: {
        // The function may check the presense of the custom property
        // on the element, such as isScaledInvoice
        //         root: ({ isScaledInvoice }) => {
        //             return {
        //                 ...(isScaledInvoice && {
        //                     fontSize: 'inherit',
        //                     padding: 'inherit'
        //                 })
        //             };
        //         }
        //     }
        // },
        /* Example of a custom component style overrides */
        // GameButtonComponent: {
        //     styleOverrides: {
        //         root: {
        //             width: 200,
        //             height: 40,
        //             borderTop: `1px solid ${colors.lime_green}`,
        //             borderLeft: `1px solid ${colors.lime_green}`,
        //             background: colors.secondary,
        //             clipPath: `polygon(
        //                 4% 0,
        //                 100% 0,
        //                 100% 80%,
        //                 94% 100%,
        //                 0 100%,
        //                 0 20%
        //             )`,
        //             '&:hover': {
        //                 border: 'none',
        //                 background: colors.primary
        //             }
        //         }
        //     }
        // }
    }
};

export default theme;
