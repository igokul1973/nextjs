import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { updateIndividual } from '@/app/lib/data/indiviidual/actions';
import { TGetLocalIdentifierNamePayload } from '@/app/lib/data/local-identifier-name/types';
import { updateOrganization } from '@/app/lib/data/organization/actions';
import { TProfile } from '@/app/lib/types';
import { TProviderIndForm } from '../../individuals/form/types';
import { TGetUserWithRelationsPayload } from '@/app/lib/data/user/types';

export interface IProps {
    profile?: TProfile;
}
export interface IProviderEntityFormDataProps {
    user: TGetUserWithRelationsPayload;
    localIdentifierName: TGetLocalIdentifierNamePayload;
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
