'use client';
import theme from '@/app/styles/theme';
import { Options } from '@emotion/cache';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import ColorModeContext from './ColorModeContext';

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry({
    options,
    children
}: {
    options?: Partial<Options> & { enableCssLayer?: boolean };
    children: React.ReactNode;
}) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
        }),
        []
    );

    const appTheme = useMemo(
        () =>
            createTheme({
                ...theme,
                palette: {
                    ...theme.palette,
                    mode
                }
            }),
        [mode]
    );

    return (
        <AppRouterCacheProvider options={options}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={appTheme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        </AppRouterCacheProvider>
    );
}
