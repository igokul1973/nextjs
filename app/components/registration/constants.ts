import { UserRoleEnum } from '@prisma/client';

export const userRoles = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];
