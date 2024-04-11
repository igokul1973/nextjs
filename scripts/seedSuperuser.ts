import { UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../app/lib/prisma.ts';
import { TProfile } from '../app/lib/types';

const { hash } = bcrypt;

export async function seedSuperuser() {
    console.log('Seeding superuser...');
    const superuser = {
        email: process.env.SUPERUSER_EMAIL || '',
        phone: process.env.SUPERUSER_PHONE || '',
        password: process.env.SUPERUSER_PASSWORD || '',
        role: UserRoleEnum.superuser
    };

    if (Object.values(superuser).some((v) => !v)) {
        throw Error(
            'The env variables for superuser are not complete or found, please check your environment.'
        );
    }

    const superuserProfile = {
        firstName: process.env.SUPERUSER_PROFILE_FIRST_NAME || 'Steven',
        lastName: process.env.SUPERUSER_PROFILE_LAST_NAME || 'Ku'
    } satisfies Pick<TProfile, 'firstName' | 'lastName'>;

    const hashedPassword = await hash(superuser.password, 10);

    const res = await prisma.account.create({
        select: {
            users: {
                select: {
                    id: true
                }
            }
        },
        data: {
            users: {
                create: { ...superuser, password: hashedPassword }
            }
        }
    });

    if (!res.users[0]?.id) {
        throw Error('The superuser ID is not found, something went wrong..');
    }

    return await prisma.profile.create({
        data: {
            ...superuserProfile,
            userId: res.users[0].id,
            createdBy: res.users[0].id,
            updatedBy: res.users[0].id
        }
    });
}
