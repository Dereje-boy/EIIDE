const express = require('express');
const router = express.Router();
const adController = require('../controllers/ad.controller');


const { auth } = require('../middlewares/auth')
const upload = require('../middlewares/uploadAdsingleImage');

// @route   POST /api/ads
// @desc    Create new advertisement
router.post('/', upload.single('image'), auth, adController.createAd);

// @route   GET /api/ads
// @desc    Get all advertisements
router.get('/', auth, adController.showCreateAdForm);

// @route   GET /api/ads/all
// @desc    Get all advertisements
router.get('/all', adController.getAllAds);

// @route   GET /api/ads/:id
// @desc    Get single advertisement
router.get('/:id', adController.getAdById);

// @route   PUT /api/ads/:id
// @desc    Update advertisement
router.put('/:id', auth, adController.updateAd);

// @route   DELETE /api/ads/:id
// @desc    Delete advertisement
router.delete('/:id', auth, adController.deleteAd);

module.exports = router;