import OpenAI from 'openai';
import { chunkText } from './utils/utils';
import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment
});

const qdrantClient = new QdrantClient({
    url: 'http://localhost:6333'
});

export async function chunkAndCreateEmbeddings(filePath: string): Promise<void> {
    try {
        const collectionName = 'smart-assistant-embeddings';
        const file = await fs.readFile(filePath, 'utf8');

        // Check if the collection exists, and create it if it doesn't
        const collectionsResponse = await qdrantClient.getCollections();
        const collectionNames = collectionsResponse.collections.map(c => c.name);

        if (!collectionNames.includes(collectionName)) {
            await qdrantClient.createCollection(collectionName, {
                vectors: {
                    size: 1536, // Ensure this matches the size of your embedding vectors
                    distance: 'Cosine' // Choose an appropriate distance metric
                }
            });
        }

        const chunks = chunkText(file, 1000);

        for (const chunk of chunks) {
            const response = await getEmbedding(chunk);

            await qdrantClient.upsert(collectionName, {
                points: [{
                    id: uuidv4(),
                    vector: response,
                    payload: {
                        content: chunk
                    }
                }]
            });
        }
    }

    catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

export async function getEmbeddingFromQdrant(embedding: number[]): Promise<number[]> {
    const results = await qdrantClient.search('smart-assistant-embeddings', {
        vector: embedding,
        limit: 1
    });

    return results[0].payload?.content as number[];
}

export async function getEmbedding(prompt: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: prompt,
    });
    return response.data[0].embedding;
}