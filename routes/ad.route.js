const express = require('express');
const router = express.Router();
const adController = require('../controllers/ad.controller');

// @route   POST /api/ads
// @desc    Create new advertisement
router.post('/', adController.createAd);

// @route   GET /api/ads
// @desc    Get all advertisements
router.get('/', adController.getAllAds);

// @route   GET /api/ads/:id
// @desc    Get single advertisement
router.get('/:id', adController.getAdById);

// @route   PUT /api/ads/:id
// @desc    Update advertisement
router.put('/:id', adController.updateAd);

// @route   DELETE /api/ads/:id
// @desc    Delete advertisement
router.delete('/:id', adController.deleteAd);

module.exports = router;