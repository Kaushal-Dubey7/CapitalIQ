const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { chat } = require('../controllers/chat.controller');

router.use(protect);
router.post('/message', chat);

module.exports = router;
