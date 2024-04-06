export interface IInventory {
    id: string;
    name: string;
    description: string | null;
    price: number;
    externalCode: string | null;
    internalCode: string | null;
    manufacturerCode: string | null;
    manufacturerPrice: number | null;
}
