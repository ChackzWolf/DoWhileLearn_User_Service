import dotenv from 'dotenv'
dotenv.config()


export const configs = {
    // LISTENER PORT
    PORT : process.env.PORT || 3001,
    // GRPC PORT CONFIG
    USER_GRPC_PORT : process.env.USER_GRPC_PORT || 5001,

    // DWL EMAIL CONFIGS
    DWL_EMAIL : process.env.EMAIL || 'dowhilelearn05@gmail.com',
    EMAIL_PASSWORD : process.env.EMAIL_PASSWORD || '',


    // DB COFNIGS
    MONGODB_URL_USER : process.env.MONGODB_URL_USER || '',
    
    
    //JWT CONFIGS
    JWT_SECRET : process.env.JWT_SECRET || '',
    REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET || '',
    JWT_EXPIRATION_TIME : process.env.JWT_EXPIRATION_TIME || '1m',
    REFRESH_TOKEN_EXPIRATION_TIME : process.env.REFRESH_TOKEN_EXPIRATION_TIME || '10d',

    // LOGGER CONFIGS
    LOG_RETENTION_DAYS : process.env.LOG_RETENTION_DAYS || '7d'
}