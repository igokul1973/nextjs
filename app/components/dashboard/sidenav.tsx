import NavLinks from '@/app/components/dashboard/nav-links';
import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import { signOut } from '@/auth';
import PowerSettingsNewOutlined from '@mui/icons-material/PowerSettingsNewOutlined';
import Link from 'next/link';

export default function SideNav() {
    return (
        <div className='flex h-full flex-col px-3 py-4 md:px-2'>
            <Link href='/'>
                <div className='w-32 text-white md:w-40'>
                    <InvoiceMeLogo />
                </div>
            </Link>
            <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
                <NavLinks />
                <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <button className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                        <PowerSettingsNewOutlined className='w-6' />
                        <div className='hidden md:block'>Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}
