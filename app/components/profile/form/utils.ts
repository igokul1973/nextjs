export const getDefaultValues = (userId: string) => ({
    id: '',
    firstName: '',
    lastName: '',
    middleName: '',
    userId,
    createdBy: userId,
    updatedBy: userId
});
