import { TIndividualForm } from '@/app/components/individuals/form/types';
import { TOrganizationForm } from '@/app/components/organizations/form/types';
import { EntitiesEnum } from '@prisma/client';
import { UseFormRegister } from 'react-hook-form';

export interface ICustomerTable {
    customerId: string;
    customerCode: string;
    customerType: EntitiesEnum;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalPending: string;
    totalPaid: string;
    totalInvoices: number;
    actions?: string;
}

export type TEntityForm = TIndividualForm | TOrganizationForm;
export type TEntityFormRegister = UseFormRegister<TIndividualForm> &
    UseFormRegister<TOrganizationForm>;
