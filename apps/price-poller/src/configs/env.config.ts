import dotenv from 'dotenv';
import z from 'zod';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env')
});

const env_schema = z.object({
    REDIS_URL: z.url(),
    MARKET_FEED_WS_URL: z.url(),
});

function parseEnv(){
    try {
        return env_schema.parse(process.env);
    } catch (error) {
        process.exit(1);
    }
}

export const env = parseEnv();