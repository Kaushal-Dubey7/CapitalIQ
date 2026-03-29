const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { generateFirePlan, getFirePlan, addGoal, updateGoal, deleteGoal } = require('../controllers/fire.controller');

router.use(protect);
router.post('/generate', generateFirePlan);
router.get('/plan', getFirePlan);
router.post('/goals', addGoal);
router.put('/goals/:id', updateGoal);
router.delete('/goals/:id', deleteGoal);

module.exports = router;
