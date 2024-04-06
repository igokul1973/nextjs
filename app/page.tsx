import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import { colors } from '@/app/styles/colors';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Page() {
    return (
        <Box className={styles.container}>
            <Box component='main' className={styles.main}>
                <Box className={styles['headline-wrapper']}>
                    <Box component='header' className={styles.header}>
                        <InvoiceMeLogo color={colors.orange} />
                        <Box component='nav' className={styles.nav}>
                            <Typography component={Link} href='#about'>
                                About
                            </Typography>
                            <Typography component={Link} href='#pricing'>
                                Prices
                            </Typography>
                            <Typography component={Link} href='/login'>
                                Log in
                            </Typography>
                        </Box>
                    </Box>
                    <Box component='main' className={styles.headline}>
                        <Typography variant='h1' sx={{ fontWeight: 'bold' }}>
                            Invoice solution for your flourising business
                        </Typography>
                        <Typography variant='h4'>
                            Give yourself and your customers ease of mind
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box component='section' className={styles.about} id='about'>
                <Typography variant='h2' sx={{ color: colors.blue }}>
                    About
                </Typography>
                <Box className={styles['about--steps']}>
                    <Box>Register</Box>
                    <Box>Add your services and products</Box>
                    <Box>Create Invoices</Box>
                    {/* <Image
                        src='/hero-desktop.png'
                        width={1000}
                        height={760}
                        alt='Screenshots whatever'
                    />
                    <Image
                        src='/hero-mobile.png'
                        width={560}
                        height={620}
                        alt='Screenshots whatever mobile'
                    /> */}
                </Box>
            </Box>
            <Box component='section' className={styles.pricing} id='pricing'>
                <Typography variant='h2' sx={{ color: colors.blue }}>
                    Pricing
                </Typography>
                <Box className={styles['pricing--plans']}>
                    <Box>Free</Box>
                    <Box>Pro</Box>
                </Box>
            </Box>
        </Box>
    );
}
