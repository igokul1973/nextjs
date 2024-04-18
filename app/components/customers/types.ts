import { TIndividualForm } from '@/app/components/individuals/create-form/types';
import { TOrganizationForm } from '@/app/components/organizations/create-form/types';
import { EntitiesEnum } from '@prisma/client';
import { UseFormRegister } from 'react-hook-form';

export interface ICustomer {
    id: string;
    type: EntitiesEnum;
    name: string;
    email: string;
    phone: string;
    totalPending: string;
    totalPaid: string;
    totalInvoices: number;
}

export type TEntityForm = TIndividualForm | TOrganizationForm;
export type TEntityFormRegister = UseFormRegister<TIndividualForm> &
    UseFormRegister<TOrganizationForm>;
