import { AttributeTypeEnum } from '@/app/components/entity-attributes/partial-form/types';
import { TAttribute, TEmail, TPhone } from '@/app/components/individuals/form/types';
import { EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';

export const getPhonesInitial = (userId: string) => {
    return [
        {
            id: '',
            countryCode: '',
            number: '',
            type: PhoneTypeEnum.mobile,
            createdBy: userId,
            updatedBy: userId
        } as TPhone
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
        } as TEmail
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
