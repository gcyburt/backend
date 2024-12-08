import { Router } from "express";
import multer from "multer";
import { chunkAndCreateEmbeddings } from "../services/embeddingService";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/uploadDocuments', upload.single('file'), async (req, res) => {
    const multerReq = req

    if (!multerReq.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const embeddings = await chunkAndCreateEmbeddings(multerReq.file.path);
    res.status(200).send('File processed successfully.');
});

export default router;