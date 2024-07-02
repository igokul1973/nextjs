'use client';

import ColorModeContext from '@/app/context/color-mode/provider';
import DataContext from '@/app/context/data/provider';
import { ICoords, IGeoData } from '@/app/lib/types';
import theme from '@/app/styles/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FC, useEffect, useMemo, useState } from 'react';
import { IProps } from './types';
import { fetchGeoData } from '@/app/lib/data/country/actions';

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
    const [location, setLocation] = useState<ICoords | null>(null);
    const [geoData, setGeoData] = useState<IGeoData | null>(null);

    useEffect(() => {
        const getGeoData = async (location: ICoords) => {
            const data = await fetchGeoData(location);
            setGeoData(data);
        };
        // Fetch data from API if `location` object is set
        if (location) {
            getGeoData(location);
        }
    }, [location]);

    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            });
        }
    }, []);

    const data = useMemo(
        () => ({ countries, organizationTypes, geoData }),
        [countries, organizationTypes, geoData]
    );

    return (
        <AppRouterCacheProvider options={options}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={appTheme}>
                    <DataContext.Provider value={data}>
                        <CssBaseline />
                        {children}
                    </DataContext.Provider>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </AppRouterCacheProvider>
    );
};

export default ThemeRegistry;
