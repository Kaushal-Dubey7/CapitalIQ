const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeTax, getTaxRecord } = require('../controllers/tax.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(protect);
router.post('/analyze', analyzeTax);
router.post('/upload-form16', upload.single('form16'), analyzeTax);
router.get('/record', getTaxRecord);

module.exports = router;
