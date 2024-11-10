import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import authRoutes from './routes/auth';
import audioFileRoutes from './routes/audioFiles';
import userRoutes from './routes/users';

const app = new Koa();
const router = new Router();

app.use(cors({
  origin: process.env.FRONTEND_URL as string,
  credentials: true
}));

app.use(bodyParser());

router.use('/auth', authRoutes.routes());
router.use('/audio_files', audioFileRoutes.routes());
router.use("/users", userRoutes.routes());

app.use(router.routes()).use(router.allowedMethods());

export default app;