const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, updateFinance, getFinance } = require('../controllers/user.controller');

router.use(protect);
router.get('/me', getProfile);
router.put('/profile', updateProfile);
router.put('/finance', updateFinance);
router.get('/finance', getFinance);

module.exports = router;
