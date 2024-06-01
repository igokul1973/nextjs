'use client';

import Box from '@mui/material/Box';
import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';

interface IProps {
    image: Buffer;
    name: string;
    type: string;
}

const ImageView: FC<IProps> = ({ image, name, type }) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const f = new File([Buffer.from(image)], name, { type });
        const url = URL.createObjectURL(f);
        setLogoUrl(url);
    }, [image, name, type]);

    return (
        <Box sx={{ height: '4vw', width: '100%', position: 'relative' }}>
            {logoUrl && <Image src={logoUrl} fill alt='Logo' />}
        </Box>
    );
};

export default ImageView;
