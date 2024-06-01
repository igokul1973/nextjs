export interface IProps {
    params: {
        id: string;
        locale: string;
    };
    searchParams: {
        number: string;
        isPdf?: string;
    };
}
