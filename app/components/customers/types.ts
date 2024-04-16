import { TIndividualForm } from '@/app/components/individuals/create-form/types';
import { TOrganizationForm } from '@/app/components/organizations/create-form/types';
import { UseFormRegister } from 'react-hook-form';

export interface ICustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export type TEntityForm = TIndividualForm | TOrganizationForm;
export type TEntityFormRegister = UseFormRegister<TIndividualForm> &
    UseFormRegister<TOrganizationForm>;
