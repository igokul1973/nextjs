'use client';
import theme from '@/app/styles/theme';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useServerInsertedHTML } from 'next/navigation';
import { useMemo, useState } from 'react';
import ColorModeContext from './ColorModeContext';

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const options = { key: 'mui' };
    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
        }),
        []
    );
    const [{ cache, flush }] = useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

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

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles
                }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={appTheme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        </CacheProvider>
    );
}
