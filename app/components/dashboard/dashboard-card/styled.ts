'use client';

import InboxOutlined from '@mui/icons-material/InboxOutlined';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import WatchLaterOutlined from '@mui/icons-material/WatchLaterOutlined';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const iconMap = {
    collected: LocalAtmOutlined,
    customers: PeopleOutlined,
    pending: WatchLaterOutlined,
    invoices: InboxOutlined
};

export const getStyledIcon = (type: keyof typeof iconMap) => {
    const Icon = iconMap[type];

    return styled(Icon, {
        name: 'Icon',
        slot: 'Root'
    })`
        height: 3rem;
        widht: 3rem;
        color: gray;
    `;
};

export const StyledCard = styled(Card)`
    border: 1px solid lightgray;
`;

export const StyledCardContent = styled(CardContent)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 5px;
    padding: 0.5rem 0.25rem;
    text-align: center;
`;

export const StyledCardContentHeading = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;
