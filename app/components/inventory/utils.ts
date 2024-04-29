import { TInventoryForm } from './form/types';

export const getDefaultFormValues = (accountId: string, userId: string): TInventoryForm => {
    return {
        accountId: accountId,
        name: '',
        description: '',
        typeId: '',
        price: null,
        externalCode: '',
        internalCode: '',
        manufacturerCode: '',
        manufacturerPrice: null,
        createdBy: userId,
        updatedBy: userId
    };
};
