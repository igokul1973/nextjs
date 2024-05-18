import { getUser } from '@/app/lib/utils';
import { FC } from 'react';

const Account: FC = async () => {
    // const t = await getI18n();
    const { account, provider, providerType } = await getUser();
    console.log(account, provider, providerType);

    return (
        <div>Bla</div>
        // <StyledAccountWrapper component='article'>
        //     <StyledProfile>
        //         <StyledAccountAttribute>
        //             <Typography variant='h6'>
        //                 {`${capitalize(t('account'))} ${t('id').toLocaleUpperCase()}`}:
        //             </Typography>
        //             <Typography variant='body1'>{account?.id}</Typography>
        //         </StyledAccountAttribute>
        //         <UpdateProviderButton />
        //         <Typography variant='h5' color='secondary.main'>
        //             {capitalize(t('provider'))}:
        //         </Typography>
        //         {!!provider && !!providerType ? (
        //             <Provider provider={provider} providerType={providerType} />
        //         ) : (
        //             <Warning variant='body1'>No provider found. Please create one.</Warning>
        //         )}
        //     </StyledProfile>
        // </StyledAccountWrapper>
    );
};

export default Account;
