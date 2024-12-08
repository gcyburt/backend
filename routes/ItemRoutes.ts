import { Router } from "express";
import { getItem, addItem, updateItem, deleteItem, addBom, addProductionSettings, updateProductionSettings, getProductionSettings } from "../services/itemsService";

const router = Router();

router.post('/get', getItem);

router.post('/add', addItem);

router.post('/update', updateItem);

router.post('/delete', deleteItem);

router.post('/addBom', addBom);

router.post('/addProductionSettings', addProductionSettings);

router.post('/updateProductionSettings', updateProductionSettings);

router.post('/getProductionSettings', getProductionSettings);

export default router;