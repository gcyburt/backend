import { Router } from "express";
import { getEmbedding, getEmbeddingFromQdrant } from "../services/embeddingService";
import { OpenAIService } from "../services/openAiService";

const router = Router();
const openAIService = new OpenAIService();

router.post('/chat', async (req, res) => {
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

export default router;