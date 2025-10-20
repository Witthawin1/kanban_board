import express from 'express'
import {sequelize} from './config/db'
import authRoutes from './routes/authRoutes'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json())
app.use('/auth' , authRoutes)

sequelize.sync({force: true}).then(() => {
    app.listen(process.env.AUTH_PORT || 3001 , () => console.log(
        'Auth service on 3001'
    ))
});