import { TInventoryForm } from './create-form/types';

export const getDefaultFormValues = (accountId: string, userId: string): TInventoryForm => {
    return {
        id: '',
        accountId: accountId,
        name: '',
        description: '',
        typeId: accountId,
        price: null,
        externalCode: '',
        internalCode: '',
        manufacturerCode: '',
        manufacturerPrice: null,
        createdBy: userId,
        updatedBy: userId
    };
};
