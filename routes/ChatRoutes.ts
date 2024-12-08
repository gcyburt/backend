import { Router } from "express";
import { getEmbedding, getEmbeddingFromQdrant } from "../services/embeddingService";
import { OpenAIService } from "../services/openAiService";

const router = Router();
const openAIService = new OpenAIService();

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        console.log('⚠️ No prompt provided in chat request');
        res.status(400).send('Prompt is required.');
        return;
    }

    try {
        console.log('📝 Generating embedding for prompt');
        const promptEmbedding = await getEmbedding(prompt);
        const retrievedEmbedding = await getEmbeddingFromQdrant(promptEmbedding);

        console.log('🔍 Retrieved embedding:', retrievedEmbedding);

        const completion = await openAIService.generateCompletion(retrievedEmbedding + prompt);
        console.log('✅ Completion generated successfully');

        res.status(200).json({ completion });
    } catch (error) {
        console.error('❌ Error generating completion:', error);
        res.status(500).send('Error generating completion.');
    }
});

export default router;