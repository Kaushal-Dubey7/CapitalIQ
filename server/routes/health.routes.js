const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { computeHealthScore, getHealthScore } = require('../controllers/health.controller');

router.use(protect);
router.post('/compute', computeHealthScore);
router.get('/score', getHealthScore);

module.exports = router;
