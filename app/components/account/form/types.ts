import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { TProfile } from '@/app/lib/types';
import { TProviderIndForm } from '../../individuals/form/types';

export interface IProps {
    profile?: TProfile;
}
export interface IProviderEntityFormDataProps {
    localIdentifierName: TGetLocalIdentifierNamePayload;
    isEdit: boolean;
}
export interface IProviderIndFormDataProps extends IProviderEntityFormDataProps {
    defaultValues: TProviderIndForm;
}
export interface IProviderOrgFormDataProps extends IProviderEntityFormDataProps {
    defaultValues: TProviderOrgForm;
}
