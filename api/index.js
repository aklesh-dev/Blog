import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} !!`);
        });
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err)
    });

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);