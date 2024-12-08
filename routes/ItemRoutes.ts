import express from 'express';

import { getItem, addItem, addBom, addProductionSettings, updateProductionSettings, getProductionSettings, updateItem, deleteItem, getAllItems } from '../services/itemsService';

const router = express.Router();

router.post('/get', getItem);

router.post('/getAll', getAllItems);

router.post('/add', addItem);

router.post('/update', updateItem);

router.post('/delete', deleteItem);

router.post('/addBom', addBom);

router.post('/addProductionSettings', addProductionSettings);

router.post('/updateProductionSettings', updateProductionSettings);

router.post('/getProductionSettings', getProductionSettings);

export default router;