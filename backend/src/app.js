import express from 'express';
import userRoutes from './routes/user.route.js';
// import { errorHandler } from './middlewares/error.middleware.js';
import cookieParser from "cookie-parser";
import cors from 'cors';


const app = express();
//checking 

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173'];
app.use(cors({
  origin:     allowedOrigins,
  credentials: true, 
}));
app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);


// app.use(errorHandler);
export default app;
