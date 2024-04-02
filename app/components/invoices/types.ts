export interface IBaseButtonProps {
    id: string;
}

export interface IUpdateButtonProps {
    href: string;
}

export interface ICreateButtonProps extends IUpdateButtonProps, IUpdateButtonProps {
    name: string;
}

export interface IDeleteButtonProps extends IBaseButtonProps {
    fn: (id: string) => void;
}
