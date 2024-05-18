'use client';

import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { capitalize } from '@mui/material';
import Typography from '@mui/material/Typography';
import { getStyledIcon, StyledCard, StyledCardContent, StyledCardContentHeading } from './styled';

export default function DashboardCard({
    title,
    value,
    type
}: {
    title: TSingleTranslationKey;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
    const Icon = getStyledIcon(type);
    const t = useI18n();

    return (
        <StyledCard sx={{ minWidth: 200 }}>
            <StyledCardContent>
                <StyledCardContentHeading>
                    {Icon ? <Icon /> : null}
                    <Typography variant='h6'>{capitalize(t(title))}</Typography>
                </StyledCardContentHeading>
                <Typography variant='body1' color='text.secondary'>
                    {value}
                </Typography>
            </StyledCardContent>
        </StyledCard>
    );
}
