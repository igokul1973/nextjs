'use client';

import ColorModeContext from '@/app/context/color-mode/provider';
import DataContext from '@/app/context/data/provider';
import theme from '@/app/styles/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FC, useMemo, useState } from 'react';
import { IProps } from './types';

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
const ThemeRegistry: FC<IProps> = ({ options, children, countries, organizationTypes }) => {
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
                    <DataContext.Provider value={{ countries, organizationTypes }}>
                        <CssBaseline />
                        {children}
                    </DataContext.Provider>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </AppRouterCacheProvider>
    );
};

export default ThemeRegistry;
