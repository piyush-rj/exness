import express from 'express';
import { env } from './configs/env.config';
import router from './routes';

const app = express();
app.use(express.json());

app.use('/api/v1', router)

app.listen(env.SERVER_PORT, () => {
    console.log(`server running on port: ${env.SERVER_PORT}`)
});