import { AttributeTypeEnum } from '@/app/components/entity-attributes/partial-form/types';
import { TAttribute, TEmail, TPhone } from '@/app/components/individuals/create-form/types';
import { EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';

export const DEFAULT_ITEMS_PER_PAGE = 5;
export const DEFAULT_PAGE_NUMBER = 0;

export const getPhonesInitial = (userId: string) => {
    return [
        {
            id: '',
            countryCode: '',
            number: '',
            type: PhoneTypeEnum.mobile,
            createdBy: userId,
            updatedBy: userId
        } as unknown as TPhone
    ];
};

export const getEmailsInitial = (userId: string) => {
    return [
        {
            id: '',
            email: '',
            type: EmailTypeEnum.main,
            createdBy: userId,
            updatedBy: userId
        } as unknown as TEmail
    ];
};

export const attributesInitial: TAttribute[] = [];

export const getEmptyAttribute = (userId: string) => {
    return {
        type: AttributeTypeEnum.text,
        name: '',
        value: '',
        createdBy: userId,
        updatedBy: userId
    };
};
