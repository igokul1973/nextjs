import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlined from '@mui/icons-material/ModeEditOutlined';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { ICreateButtonProps, IDeleteButtonProps, IUpdateButtonProps } from './types';

export function CreateButton({ href, name }: ICreateButtonProps) {
    return (
        <Link href={href} passHref>
            <Button variant='contained' color='secondary'>
                {name}
                <AddOutlined className='h-5 md:ml-4' />
            </Button>
        </Link>
    );
}

export function UpdateButton({ href }: IUpdateButtonProps) {
    return (
        <Link href={href}>
            <ModeEditOutlined />
        </Link>
    );
}

export function DeleteButton({ id, fn }: IDeleteButtonProps) {
    const deleteFnWithId = fn.bind(null, id);
    return (
        <form action={deleteFnWithId}>
            <button>
                <span>Delete</span>
                <DeleteOutlineOutlined className='w-5' />
            </button>
        </form>
    );
}
