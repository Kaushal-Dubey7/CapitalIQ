const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeEvent } = require('../controllers/lifeevents.controller');

router.use(protect);
router.post('/analyze', analyzeEvent);

module.exports = router;
