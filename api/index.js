import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} !!`);
        });
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err)
    });

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);


// --middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
}); 