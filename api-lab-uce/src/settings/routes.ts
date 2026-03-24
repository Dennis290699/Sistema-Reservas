import { Router } from 'express';
import { getSettings, updateSetting, purgeHistory } from './controller';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// Protect ALL routes with Super Admin tokens since this is the global configuration layer
router.use(authenticateToken);
router.use(authorize(['admin']));

router.get('/', getSettings);
router.put('/:key', updateSetting);
router.post('/purge-history', purgeHistory);

export default router;
