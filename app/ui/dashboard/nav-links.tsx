'use client';

import Home from '@mui/icons-material/Home';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PostAddOutlined from '@mui/icons-material/PostAddOutlined';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: 'Home', href: '/dashboard', icon: Home },
    {
        name: 'Invoices',
        href: '/dashboard/invoices',
        icon: PostAddOutlined
    },
    { name: 'Customers', href: '/dashboard/customers', icon: PeopleOutlined }
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link key={link.name} href={link.href}>
                        <LinkIcon className='w-6' />
                        <p className='hidden md:block'>{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
