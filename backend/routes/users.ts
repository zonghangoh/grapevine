import Router from 'koa-router';
import { authoriseAdmin } from '../middleware/auth';
import { index, create, update, destroy } from '../controllers/users';

const router = new Router();

router.get('/', authoriseAdmin, index);
router.post('/', authoriseAdmin, create);
router.put('/:id', authoriseAdmin, update);
router.delete('/:id', authoriseAdmin, destroy);

export default router;