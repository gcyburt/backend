export type Item = {
    id: string;
    name: string;
    description: string;
}

export type ItemBomElement = {
    parentId: string;
    elementId: string;
    quantity: number;
    unit: string;
}

export type ItemProductionSettings = {
    id: string;
    itemId: string;
    itemVersion: string;
    equipment: string;
    speed: string;
    efficiency: string;
}