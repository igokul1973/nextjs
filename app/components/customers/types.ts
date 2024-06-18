import { TProviderIndForm } from '@/app/components/individuals/form/types';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { EntitiesEnum } from '@prisma/client';
import { UseFormRegister } from 'react-hook-form';

export interface ICustomerTable {
    customerId: string;
    customerCode?: string | null;
    customerType: EntitiesEnum;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalPending: string;
    totalPaid: string;
    totalInvoices: number;
    actions?: string;
}

export type TEntityForm = TProviderIndForm | TProviderOrgForm;
export type TEntityFormRegister = UseFormRegister<TProviderIndForm> &
    UseFormRegister<TProviderOrgForm>;
