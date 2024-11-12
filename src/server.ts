import express, { Request } from 'express';
import { authenticateUser, registerUser, getUserProfile } from './authService';
import cors from 'cors';
import multer, { File } from 'multer';
import { chunkAndCreateEmbeddings, getEmbedding, getEmbeddingFromQdrant } from './embeddingService';
import { OpenAIService } from './openAiService'; // Import the OpenAIService

const app = express();
const upload = multer({ dest: 'uploads/' }); // Configure multer to store files in 'uploads/' directory

const openAIService = new OpenAIService(); // Instantiate the OpenAIService

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.post('/login', authenticateUser);
app.post('/register', registerUser);

app.get('/profile', getUserProfile);

// Extend the Request interface to include the 'file' property
interface MulterRequest extends Request {
    file: File;
}

app.post('/uploadDocuments', upload.single('file'), async (req, res) => {
    const multerReq = req as MulterRequest; // Type assertion

    if (!multerReq.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const embeddings = await chunkAndCreateEmbeddings(multerReq.file.path);
    res.status(200).send('File processed successfully.');
});

app.post('/chat', async (req, res) => {
    const { prompt } = req.body; // Extract the prompt from the request body

    if (!prompt) {
        res.status(400).send('Prompt is required.');
        return;
    }

    try {
        const promptEmbedding = await getEmbedding(prompt);
        const retrievedEmbedding = await getEmbeddingFromQdrant(promptEmbedding);

        console.log(retrievedEmbedding);

        const completion = await openAIService.generateCompletion(retrievedEmbedding + prompt); // Generate completion

        res.status(200).json({ completion }); // Send the completion as a JSON response
    } catch (error) {
        res.status(500).send('Error generating completion.');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});