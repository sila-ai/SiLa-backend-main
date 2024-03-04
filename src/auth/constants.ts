import * as dotenv from 'dotenv';

dotenv.config()

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
};

export const googleConstants = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    callback_url: process.env.GOOGLE_CALLBACK_URL,
};
