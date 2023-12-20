import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import globalErrorhandler from "./controllers/ErrorController.js"
import authRouter from './routes/authRoutes.js'
import gradeRouter from './routes/gradeRoutes.js'
import classRouter from './routes/classRoutes.js'
import postRouter from './routes/postRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import google from './config/passport-setup.js'
import facebook from './config/passport-setup.js'


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

app.use('/webAdvanced/api/v1/auth', authRouter)
app.use('/webAdvanced/api/v1/classes', classRouter)
app.use('/webAdvanced/api/v1/posts', postRouter)
app.use('/webAdvanced/api/v1/grade', gradeRouter)
app.use('/webAdvanced/api/v1/review',reviewRouter)
app.use('/webAdvanced/api/v1/notification',notificationRouter)
app.use(globalErrorhandler);

export default app;