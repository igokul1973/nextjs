'use client';

import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDebounce } from '../lib/utils';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    useEffect(() => {
        console.log(searchParams);
        console.log(searchParams);
    }, [searchParams]);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams || undefined);
        // When user types new/updates old query, the page
        // should always reset to 1.
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const debouncedHandleSearch = useDebounce<string>(handleSearch, 400);

    return (
        <div>
            <TextField
                label='Search'
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
        </div>
    );
}
