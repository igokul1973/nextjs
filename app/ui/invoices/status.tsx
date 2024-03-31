import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
    return (
        <span
            className={clsx('inline-flex items-center rounded-full px-2 py-1 text-xs', {
                'bg-gray-100 text-gray-500': status === 'pending',
                'bg-green-500 text-white': status === 'paid'
            })}
        >
            {status === 'pending' ? (
                <>
                    Pending
                    <AccessTimeOutlined className='ml-1 w-4 text-gray-500' />
                </>
            ) : null}
            {status === 'paid' ? (
                <>
                    Paid
                    <CheckOutlined className='ml-1 w-4 text-white' />
                </>
            ) : null}
        </span>
    );
}
