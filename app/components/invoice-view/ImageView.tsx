'use client';

import Box from '@mui/material/Box';
import { FC } from 'react';
import { IImageViewProps } from './types';

const ImageView: FC<IImageViewProps> = ({ url }) => {
    return (
        <Box sx={{ height: '4vw', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box
                component='img'
                src={url}
                alt='Logo'
                sx={{
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </Box>
    );
};

export default ImageView;
