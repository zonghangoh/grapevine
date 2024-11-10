import Router from 'koa-router';
import { verify, login, logout } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = new Router();

router.get('/verify', authenticate, verify);
router.post('/login', login);
router.post('/logout', logout);

export default router;