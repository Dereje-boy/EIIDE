const adModel = require('../models/adModel');

// @desc    Create new advertisement
// @route   POST /api/ads
exports.createAd = async (req, res) => {
    console.log('inserting new ad')
    try {
        const image = `/uploads/ads/${req.file.filename}`;
        const adId = await adModel.createAdvertisement(image);

        res.json({
            success: true,
            message: 'Advertisement created and ready for display',
            reason: null,
            data: { ad_id: adId }
        });
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Try compressing your image file below 2MB or using PNG/JPG format',
            reason: `Database error: ${error.message}`
        });
    }
};

exports.showCreateAdForm = async (req, res) => {
    res.render('ad/ad.handlebars')
}

// @desc    Get all advertisements
// @route   GET /api/ads
exports.getAllAds = async (req, res) => {
    try {
        const ads = await adModel.getAllAdvertisements();

        res.json({
            success: true,
            message: 'All active advertisements retrieved',
            reason: null,
            data: ads
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try refreshing the page or check your network connection',
            reason: `Server error: ${error.message}`
        });
    }
};

// @desc    Get single advertisement
// @route   GET /api/ads/:id
exports.getAdById = async (req, res) => {
    try {
        const ad = await adModel.getAdvertisementById(req.params.id);

        if (!ad) {
            return res.json({
                success: false,
                message: 'Try searching for another advertisement ID from the main list',
                reason: 'No advertisement found with the provided ID'
            });
        }

        res.json({
            success: true,
            message: 'Advertisement details retrieved',
            reason: null,
            data: ad
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try again later or contact support if the problem persists',
            reason: `Lookup error: ${error.message}`
        });
    }
};

// @desc    Update advertisement
// @route   PUT /api/ads/:id
exports.updateAd = async (req, res) => {
    try {
        const affectedRows = await adModel.updateAdvertisementImage(
            req.params.id,
            req.body.image
        );

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Verify the advertisement ID from your management console',
                reason: 'Target advertisement does not exist in database'
            });
        }

        res.json({
            success: true,
            message: 'Advertisement image successfully updated',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ensure the new image meets format requirements before retrying',
            reason: `Update failed: ${error.message}`
        });
    }
};

// @desc    Delete advertisement
// @route   DELETE /api/ads/:id
exports.deleteAd = async (req, res) => {
    try {
        const affectedRows = await adModel.deleteAdvertisement(req.params.id);

        if (affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Confirm the advertisement exists in your current view',
                reason: 'No records were deleted - ID not found'
            });
        }

        res.json({
            success: true,
            message: 'Advertisement permanently removed from the system',
            reason: null
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Try deleting from the advertisement management panel instead',
            reason: `Deletion blocked: ${error.message}`
        });
    }
};