import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './lib/swagger';
import { authRouter } from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

setupSwagger(app);

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`,
  );
});
