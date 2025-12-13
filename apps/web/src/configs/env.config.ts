import dotenv from 'dotenv';
import z from 'zod';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env')
});

const env_schmae = z.object({
    NEXT_PUBLIC_BACKEND_URL: z.url(),
    NEXTAUTH_URL: z.string().transform(val => val.trim()),
});

function parseEnv() {
    try {
        return env_schmae.parse(process.env);
    } catch (error) {
        console.log('error in env parseing', error);
        process.exit(1);
    }
}

export const env = parseEnv();