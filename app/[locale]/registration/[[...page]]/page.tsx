import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import Loading from '@/app/components/loading/Loading';
import CountryRegistrationFormData from '@/app/components/registration/CountryRegistrationFormData';
import ProfileRegistrationForm from '@/app/components/registration/ProfileRegistrationForm';
import ProviderRegistrationForm from '@/app/components/registration/ProviderRegistrationForm';
import SettingsRegistrationForm from '@/app/components/registration/SettingsRegistrationForm';
import UserRegistrationForm from '@/app/components/registration/UserRegistrationForm';
import { submitRegistration } from '@/app/lib/data/user/actions';
import { colors } from '@/app/styles/colors';
import { auth } from '@/auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import { IProps } from '../../types';
import {
    ButtonsBox,
    ContainerBox,
    FormWrapperBox,
    StyledFormActionButton,
    StyledLinkButton
} from './styled';

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const RegistrationPage: FC<IProps> = async ({ params: { locale, page } }) => {
    setStaticParamsLocale(locale);

    const pageMap = [
        {
            name: 'user',
            component: UserRegistrationForm
        },
        {
            name: 'profile',
            component: ProfileRegistrationForm
        },
        {
            name: 'country',
            component: CountryRegistrationFormData
        },
        {
            name: 'provider',
            component: ProviderRegistrationForm
        },
        {
            name: 'settings',
            component: SettingsRegistrationForm
        }
    ] as const;

    if (!page || (page[0] && !pageMap.find((p) => p.name === page[0]))) {
        redirect('/registration/user');
    }

    const session = await auth();
    if (!session?.user?.email) {
        redirect('/');
    }

    const userEmail = session.user.email;
    const userFullName = session.user.name;

    let currentPageIndex = pageMap.findIndex((p) => p.name === page[0]);

    if (currentPageIndex === -1) {
        currentPageIndex = 0;
    }

    const CurrentFormComponent = pageMap[currentPageIndex].component;
    const previousPageName = pageMap[currentPageIndex - 1]?.name ?? pageMap.at(0)?.name;
    const nextPageName = pageMap[currentPageIndex + 1]?.name ?? pageMap.at(-1)?.name;

    return (
        <ContainerBox component='main'>
            <Box className='headline-wrapper'>
                <Box component='header' className='header'>
                    <Box component={Link} href='/' sx={{ textDecoration: 'none' }}>
                        <InvoiceMeLogo color={colors.orange} />
                    </Box>
                </Box>
                <FormWrapperBox component='article' className='form-wrapper'>
                    <Typography variant='h4'>Welcome {userFullName}!</Typography>
                    <Suspense fallback={<Loading />}>
                        <CurrentFormComponent />
                    </Suspense>
                    <ButtonsBox>
                        <Box>
                            {currentPageIndex > 0 && (
                                <StyledLinkButton
                                    href={`/registration/${previousPageName}`}
                                    name='Previous'
                                />
                            )}
                        </Box>
                        <Box>
                            {currentPageIndex < pageMap.length - 1 ? (
                                <StyledLinkButton
                                    href={`/registration/${nextPageName}`}
                                    name='Next'
                                />
                            ) : (
                                <StyledFormActionButton action={submitRegistration} name='Submit' />
                            )}
                        </Box>
                    </ButtonsBox>
                </FormWrapperBox>
            </Box>
        </ContainerBox>
    );
};
export default RegistrationPage;
