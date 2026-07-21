const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const auth = require('../middleware/authMiddleware');

router.get('/', bannerController.getBanners);
router.put('/:id/toggle', auth, bannerController.toggleBanner);

module.exports = router;
