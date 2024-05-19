import { TOrganizationForm } from '@/app/components/organizations/form/types';
import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TProfile } from '@/app/lib/types';
import { z } from 'zod';
import { TIndividualForm } from '../../individuals/form/types';
import { profileUpdateSchema } from './formSchema';

export interface IProps {
    profile?: TProfile;
}
export interface IProviderEntityFormDataProps {
    localIdentifierName: TGetLocalIdentifierNamePayload;
    isEdit: boolean;
}
export interface IProviderIndFormDataProps extends IProviderEntityFormDataProps {
    rawDefaultValues: TIndividualForm;
}
export interface IProviderOrgFormDataProps extends IProviderEntityFormDataProps {
    rawDefaultValues: TOrganizationForm;
}

export type TProfileForm = z.input<typeof profileUpdateSchema>;
export type TProfileFormOutput = z.output<typeof profileUpdateSchema>;
