import Router from 'koa-router';
import { authenticate } from '../middleware/auth';
import { getUploadUrl, getDownloadUrl, create, index, update, destroy } from '../controllers/audioFiles';

const router = new Router();

router.get('/', authenticate, index);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, destroy);

router.post('/presigned-url', authenticate, getUploadUrl);
router.get('/:id/presigned-url', authenticate, getDownloadUrl);

export default router;