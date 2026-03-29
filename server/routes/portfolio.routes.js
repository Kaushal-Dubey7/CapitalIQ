const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzePortfolio, getPortfolio } = require('../controllers/portfolio.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);
router.post('/analyze', upload.single('statement'), analyzePortfolio);
router.get('/', getPortfolio);

module.exports = router;
