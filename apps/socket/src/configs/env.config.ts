import dotenv from 'dotenv';
import path, { parse } from 'path';
import z from 'zod';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env')
});

const env_schema = z.object({
    SOCKET_REDIS_URL: z.url(),
    SOCKET_PORT: z.string().default('8080').transform(val => val.trim()),
});

function parse_env() {
    try {
        return env_schema.parse(process.env);
    } catch (error) {
        process.exit(1);
    }
}

export const env = parse_env();