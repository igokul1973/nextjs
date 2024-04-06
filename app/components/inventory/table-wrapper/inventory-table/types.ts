export interface IProps {
    inventory: IInventory[];
}

export interface ColumnData {
    dataKey: keyof IInventory;
    label: string;
    numeric?: boolean;
    width: number;
}
