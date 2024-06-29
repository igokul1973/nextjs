import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { updateIndividual } from '@/app/lib/data/indiviidual/actions';
import { updateOrganization } from '@/app/lib/data/organization/actions';
import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';
import { TAppLocalIdentifierName, TProfile } from '@/app/lib/types';
import { TProviderIndForm } from '../../individuals/form/types';

export interface IProps {
    profile?: TProfile;
}
export interface IProviderEntityFormDataProps {
    user: TGetUserWithRelationsPayload;
    localIdentifierName: TAppLocalIdentifierName;
    isEdit: boolean;
    updateProviderState: (
        provider: Awaited<ReturnType<typeof updateIndividual | typeof updateOrganization>>
    ) => void;
    goBack?: () => void;
}
export interface IProviderIndFormDataProps extends IProviderEntityFormDataProps {
    defaultValues: TProviderIndForm;
}
export interface IProviderOrgFormDataProps extends IProviderEntityFormDataProps {
    defaultValues: TProviderOrgForm;
}
