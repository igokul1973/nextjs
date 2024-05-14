'use client';

import { lusitana } from '@/app/styles/fonts';
import CallMadeOutlined from '@mui/icons-material/CallMadeOutlined';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { FC } from 'react';
import { IProps } from './types';

const LatestInvoices: FC<IProps> = async ({ latestInvoices }) => {
    return (
        <Box className='flex w-full flex-col md:col-span-4'>
            <Typography component='h2' className={`${lusitana.className}`}>
                Latest Invoices
            </Typography>
            <Box className='flex grow flex-col justify-between rounded-xl bg-gray-50 p-4'>
                {/* NOTE: comment in this code when you get to this point in the course */}

                <Box className='bg-white px-6'>
                    {latestInvoices.map((invoice, i) => {
                        return (
                            <Box
                                key={invoice.number}
                                className={clsx('flex flex-row items-center justify-between py-4', {
                                    'border-t': i !== 0
                                })}
                            >
                                <Box className='flex items-center'>
                                    <Box className='min-w-0'>
                                        <Typography className='truncate text-sm font-semibold md:text-base'>
                                            {invoice.name}
                                        </Typography>
                                        <Typography className='hidden text-sm text-gray-500 sm:block'>
                                            {invoice.email}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {invoice.amount}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
                <Box className='flex items-center pb-2 pt-6'>
                    <CallMadeOutlined />
                    <Typography component='h3'>Updated just now</Typography>
                </Box>
            </Box>
        </Box>
    );
};
export default LatestInvoices;
