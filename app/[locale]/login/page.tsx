import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import LoginForm from '@/app/components/login-form/LoginForm';
import { FC } from 'react';
import { IProps } from '../types';
import { setStaticParamsLocale } from 'next-international/server';

const LoginPage: FC<IProps> = ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    return (
        <main className='flex items-center justify-center md:h-screen'>
            <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
                <div className='flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36'>
                    <div className='w-32 text-white md:w-36'>
                        <InvoiceMeLogo />
                    </div>
                </div>
                <LoginForm />
            </div>
        </main>
    );
};
export default LoginPage;
