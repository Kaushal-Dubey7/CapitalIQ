const TaxRecord = require('../models/TaxRecord.model');
const taxEngine = require('../services/taxEngine');
const aiService = require('../services/aiService');
const pdfParser = require('../services/pdfParser');
const { sendSuccess } = require('../utils/responseUtils');

exports.analyzeTax = async (req, res, next) => {
  try {
    let taxData = req.body;
    if (req.file) {
      const extracted = await pdfParser.extractForm16(req.file.buffer);
      taxData = { ...taxData, ...extracted };
    }
    const analysis = taxEngine.analyze(taxData);
    const aiSuggestions = await aiService.generateTaxSuggestions(analysis);
    const record = await TaxRecord.findOneAndUpdate(
      { userId: req.user._id, financialYear: taxData.financialYear || '2024-25' },
      { userId: req.user._id, ...analysis, aiSuggestions },
      { upsert: true, new: true }
    );
    sendSuccess(res, 200, 'Tax analysis complete', { taxRecord: record });
  } catch (err) { next(err); }
};

exports.getTaxRecord = async (req, res, next) => {
  try {
    const record = await TaxRecord.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Tax record fetched', { taxRecord: record });
  } catch (err) { next(err); }
};
