import { lusitana } from '@/app/styles/fonts';
import Receipt from '@mui/icons-material/Receipt';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './acme-logo.module.scss';

interface IProps {
    color?: string;
}

export default function AcmeLogo({ color }: IProps) {
    return (
        <Box component='span' className={`${styles['logo-wrapper']}`} sx={{ color }}>
            <Receipt className={styles.icon} />
            <Typography variant='h1' sx={{ fontFamily: lusitana.style.fontFamily }}>
                InvoiceMe
            </Typography>
        </Box>
    );
}
