export const getDefaultValues = (userId: string) => ({
    id: '',
    avatar: null,
    firstName: '',
    lastName: '',
    middleName: '',
    userId,
    createdBy: userId,
    updatedBy: userId
});
