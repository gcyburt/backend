import express from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import documentsRoutes from './routes/DocumentsRoutes';
import chatRoutes from './routes/ChatRoutes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/documents', documentsRoutes);
app.use('/chat', chatRoutes);

app.listen(3000, () => {
    console.log('🚀 Server running on port 3000');
});