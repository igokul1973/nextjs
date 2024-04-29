'use client';

import { useI18n } from '@/locales/client';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '../../lib/utils';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const t = useI18n();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams || undefined);
        // When user types new/updates old query, the page
        // should always reset to 1.
        params.set('page', '0');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const debouncedHandleSearch = useDebounce<string>(handleSearch, 400);

    return (
        <Box sx={{ width: '350px' }}>
            <TextField
                fullWidth
                label={capitalize(t('search'))}
                variant='outlined'
                placeholder={placeholder}
                onChange={(e) => {
                    debouncedHandleSearch(e.target.value);
                }}
                defaultValue={searchParams?.get('query')?.toString()}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <SearchOutlined />
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    );
}
