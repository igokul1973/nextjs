'use client';

import { useState } from 'react';

interface IProps {
    callback: () => Promise<{ count: number; newAmount: number }>;
}

const UpdateButton = ({ callback }: IProps) => {
    const [updatedInvoiceCount, setUpdatedInvoiceCount] = useState<number>(0);
    const [newAmount, setNewAmount] = useState<number>(0);

    const runUpdate = async () => {
        const invoices = await callback();
        setUpdatedInvoiceCount(invoices.count);
        setNewAmount(invoices.newAmount);
    };
    return (
        <>
            <div>Invoices: {updatedInvoiceCount}</div>
            <div>New amount: {newAmount}</div>
            <button onClick={runUpdate} className='bg-amber-400 p-2'>
                Update invoices
            </button>
        </>
    );
};

export default UpdateButton;
