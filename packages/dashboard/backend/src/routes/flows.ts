import { Router } from 'express';
import {
  getFlows,
  getFlowById,
  createFlow,
  deleteFlow,
  getAgents,
  getLogs,
  getPlan,
  runFlow,
} from '../controllers/flows';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getFlows));
router.post('/', asyncHandler(createFlow));
router.get('/:id', asyncHandler(getFlowById));
router.delete('/:id', asyncHandler(deleteFlow));
router.get('/:id/agents', asyncHandler(getAgents));
router.get('/:id/logs', asyncHandler(getLogs));
router.get('/:id/plan', asyncHandler(getPlan));
router.post('/:id/run', asyncHandler(runFlow));

export default router;
