import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.routes.js'; 

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

export default app;