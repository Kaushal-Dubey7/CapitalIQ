const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { linkPartner, generateCouplesPlan, getCouplesPlan } = require('../controllers/couples.controller');

router.use(protect);
router.post('/link', linkPartner);
router.post('/plan', generateCouplesPlan);
router.get('/plan', getCouplesPlan);

module.exports = router;
