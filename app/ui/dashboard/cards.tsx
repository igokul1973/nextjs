import { fetchCardData } from '@/app/lib/data/card';
import { lusitana } from '@/app/ui/fonts';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import WatchLaterOutlined from '@mui/icons-material/WatchLaterOutlined';
import InboxOutlined from '@mui/icons-material/InboxOutlined';

const iconMap = {
    collected: LocalAtmOutlined,
    customers: PeopleOutlined,
    pending: WatchLaterOutlined,
    invoices: InboxOutlined
};

export default async function CardWrapper() {
    const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } =
        await fetchCardData();
    return (
        <>
            {/* NOTE: comment in this code when you get to this point in the course */}
            <Card title='Collected' value={totalPaidInvoices} type='collected' />
            <Card title='Pending' value={totalPendingInvoices} type='pending' />
            <Card title='Total Invoices' value={numberOfInvoices} type='invoices' />
            <Card title='Total Customers' value={numberOfCustomers} type='customers' />
        </>
    );
}

export function Card({
    title,
    value,
    type
}: {
    title: string;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
    const Icon = iconMap[type];

    return (
        <div className='rounded-xl bg-gray-50 p-2 shadow-sm'>
            <div className='flex p-4'>
                {Icon ? <Icon className='h-5 w-5 text-gray-700' /> : null}
                <h3 className='ml-2 text-sm font-medium'>{title}</h3>
            </div>
            <p
                className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
                {value}
            </p>
        </div>
    );
}
