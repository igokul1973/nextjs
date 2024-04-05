import AcmeLogo from '@/app/components/acme-logo/acme-logo';
import { colors } from '@/app/styles/colors';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Page() {
    return (
        <Box>
            <Box component='main' className={styles.main}>
                <Box className={styles['headline-wrapper']}>
                    <Box component='header' className={styles.header}>
                        <AcmeLogo color={colors.orange} />
                        <Box component='nav' className={styles.nav}>
                            <Typography component='span'>Prices</Typography>
                            <Typography component='span'>About</Typography>
                            <Typography component={Link} href='/login'>
                                Log in
                            </Typography>
                        </Box>
                    </Box>
                    <Box component='main' className={styles.headline}>
                        <Typography variant='h1' sx={{ fontWeight: 'bold' }}>
                            Invoice solution for your flourising business
                        </Typography>
                        <Typography variant='h4'>Give your customers ease of mind</Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <div>
                    <p>
                        <strong>Welcome to InvoiceMe.biz</strong> This is the example for the{' '}
                        <a href='https://nextjs.org/learn/' className='text-blue-500'>
                            Next.js Learn Course
                        </a>
                        , brought to you by Vercel.
                    </p>
                    <Link href='/login'>
                        <span>Log in</span> <ArrowRight className='w-5 md:w-6' />
                    </Link>
                </div>
                <div>
                    {/* Add Hero Images Here */}
                    <Image
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
                    />
                </div>
            </Box>
            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur exercitationem,
                unde maiores, asperiores, dolores inventore expedita sit dicta error fugiat
                necessitatibus commodi vero voluptate. Ut quo odit sapiente reprehenderit odio a
                distinctio, magnam saepe dicta quas quos laborum consequuntur repellendus enim,
                optio unde corrupti numquam ipsa culpa aut nostrum minima. Exercitationem nostrum,
                perspiciatis veritatis deleniti cum voluptate qui quod eligendi eius eum aspernatur!
                Animi excepturi quaerat repudiandae ex at labore, consequuntur in eum! Repellat
            </div>
        </Box>
    );
}
