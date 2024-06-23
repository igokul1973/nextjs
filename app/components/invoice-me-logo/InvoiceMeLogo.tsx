import { lusitana } from '@/app/styles/fonts';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledLogoIcon, StyledLogoWrapper } from './styled';
import { IProps } from './types';

const InvoiceMeLogo: FC<IProps> = ({ color }) => {
    return (
        <StyledLogoWrapper component='span' sx={{ color }}>
            <StyledLogoIcon />
            <Typography variant='h3' sx={{ fontFamily: lusitana.style.fontFamily }}>
                InvoiceMe
            </Typography>
        </StyledLogoWrapper>
    );
};
export default InvoiceMeLogo;
