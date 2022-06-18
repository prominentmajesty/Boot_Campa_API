const express = require('express');
const { 
    getbootcamps,
    getbootcamp ,
    createbootcamp,
    Updatebootcamp,
    deletebootcamps,
    getBootcampsInRadius,
    getbootcampByFiltering,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
.route('/filter')
.get(protect, getbootcampByFiltering);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'curses'), getbootcamps)
    .post(protect, authorize('publisher', 'admin'), createbootcamp);

router
    .route('/:id')
    .get(getbootcamp)
    .put(protect, authorize('publisher', 'admin'), Updatebootcamp)
    .delete(protect, authorize('publisher', 'admin'), deletebootcamps);

    
module.exports = router;