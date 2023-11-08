import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from "./app.js";

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 5000;

mongoose
    .connect(process.env.DATABASE)
    .then(() => {
        console.log('Connected to DB successfully');
    });

const server = app.listen(port, async () => {
    console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection. Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1); // 0 is success, 1 is uncaught exception
    });
});
