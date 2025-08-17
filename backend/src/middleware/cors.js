import cors from 'cors';

const allowedOrigins = [
            process.env.CORS_ORIGIN,
            'http://localhost:5173', 
            'http://localhost:3000',
        ].filter(Boolean)

const corsOptions = {
    origin(origin, callback) {
        //Allow requests with no origin 
        if(!origin) return callback(null, true);


        if(allowedOrigins.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error("Not allowed by Cors"))
        }
    },

    Credential: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200, // For legacy browser support
}

export default cors(corsOptions)