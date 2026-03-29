const User = require('../models/User.model');
const Finance = require('../models/Finance.model');
const Profile = require('../models/Profile.model');
const { sendSuccess, sendError } = require('../utils/responseUtils');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const profile = await Profile.findOne({ userId: req.user._id });
    const finance = await Finance.findOne({ userId: req.user._id });
    sendSuccess(res, 200, 'Profile fetched', { user, profile, finance });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...req.body },
      { upsert: true, new: true }
    );
    sendSuccess(res, 200, 'Profile updated', { profile });
  } catch (err) { next(err); }
};

exports.updateFinance = async (req, res, next) => {
  try {
    const finance = await Finance.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...req.body },
      { upsert: true, new: true }
    );
    sendSuccess(res, 200, 'Finance updated', { finance });
  } catch (err) { next(err); }
};

exports.getFinance = async (req, res, next) => {
  try {
    const finance = await Finance.findOne({ userId: req.user._id });
    sendSuccess(res, 200, 'Finance fetched', { finance });
  } catch (err) { next(err); }
};
