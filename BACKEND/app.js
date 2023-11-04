import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import globalErrorhandler from "./controllers/ErrorController.js"

const limiter = rateLimit({
  // limiter is now become a middleware function
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try this again in an hour!',
}); // define how many requests per IP we are going to allow in a certain of time

const app = express();
app.use(limiter);
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json({ limit: '10mb' }));

app.use(globalErrorhandler);

export default app;