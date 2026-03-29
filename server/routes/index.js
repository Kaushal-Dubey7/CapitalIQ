const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));
router.use('/fire', require('./fire.routes'));
router.use('/health', require('./health.routes'));
router.use('/lifeevents', require('./lifeevents.routes'));
router.use('/tax', require('./tax.routes'));
router.use('/couples', require('./couples.routes'));
router.use('/portfolio', require('./portfolio.routes'));
router.use('/chat', require('./chat.routes'));

router.get('/ping', (req, res) => {
  res.json({ status: 'ok', app: 'CapitalIQ', time: new Date() });
});

module.exports = router;
