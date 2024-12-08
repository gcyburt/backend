import { Request, Response, NextFunction } from 'express';
import Neo4jService from './neo4jService';
import { Item, ItemBomElement, ItemProductionSettings } from '../models/Item';
import prisma from './prismaService';

const neo4jService = new Neo4jService();

export const getItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.body;
}

export const addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, name, description }: Item = req.body;

    const result = await neo4jService.query('CREATE (item:Item {itemId: $id, name: $name, description: $description})', { id, name, description });

    res.status(200).json(result);
}

export const addBom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { parentId, elementId, quantity, unit }: ItemBomElement = req.body;

    const result = await neo4jService.query(
        'MATCH (parent:Item {itemId: $parentId}), (element:Item {itemId: $elementId}) ' +
        'CREATE (parent)-[:HAS_BOM {quantity: $quantity, unit: $unit}]->(element)',
        { parentId, elementId, quantity, unit }
    );

    res.status(200).json(result);
}

export const addProductionSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { itemId, itemVersion, equipment, speed, efficiency }: ItemProductionSettings = req.body;

    const result = await prisma.itemProductionSettings.create({
        data: { itemId, itemVersion, equipment, speed, efficiency }
    });

    res.status(200).json(result);
}

export const updateProductionSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, itemId, itemVersion, equipment, speed, efficiency }: ItemProductionSettings = req.body;

    const result = await prisma.itemProductionSettings.update({
        where: { id },
        data: { itemId, itemVersion, equipment, speed, efficiency }
    });

    res.status(200).json(result);
}

export const getProductionSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { itemId, itemVersion } = req.body;

    const result = await prisma.itemProductionSettings.findMany({
        where: { itemId, itemVersion }
    });

    res.status(200).json(result);
}

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.body;
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.body;
}