import { Router } from "express";
import multer from "multer";
import { chunkAndCreateEmbeddings } from "../services/embeddingService";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/uploadDocuments', upload.single('file'), async (req, res) => {
    const multerReq = req;

    if (!multerReq.file) {
        console.log('⚠️ No file uploaded');
        res.status(400).send('No file uploaded.');
        return;
    }

    console.log('📄 Processing uploaded file:', multerReq.file.path);
    const embeddings = await chunkAndCreateEmbeddings(multerReq.file.path);
    console.log('✅ File processed successfully');

    res.status(200).send('File processed successfully.');
});

export default router;