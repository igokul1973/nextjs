import prisma from '@/app/lib/prisma';

export async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return user;
    } catch (error) {
        console.log('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user.');
    }
}
