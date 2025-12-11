import { env } from "../configs/env.config";

export const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;
export const API_URL = BACKEND_URL + '/api/v1';

// user-controllers
export const SIGNIN_URL = API_URL + '/sign-in';