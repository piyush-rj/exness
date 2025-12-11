import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env')
});

const env_schema = z.object({
    SERVER_PORT: z
        .string()
        .default('8787')
        .transform((val) => parseInt(val, 10)),
    SERVER_REDIS_URL: z.url(),
    SERVER_JWT_SECRET: z.string().transform(val => val.trim()),
});

function parseEnv() {
    try {
        return env_schema.parse(process.env);
    } catch (error) {
        process.exit(1);
    }
}

export const env = parseEnv();