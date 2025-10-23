import express from 'express';
import { sequelize } from './config/db';
import boardRoutes from './routes/boardRoutes';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();
const app = express();

app.use(cors())
app.use(express.json());
app.use('/', boardRoutes);

sequelize.sync({ force: true }).then(() => {
  app.listen(process.env.BOARD_PORT || 3002, () => console.log('Board service on 3002'));
});