const express = require('express');
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');
const advancedResults = require('../middleware/advancedResult');

const Course = require('../models/Course');

const router = express.Router({mergeParams : true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
.get(advancedResults('Courses', {
    path : 'bootcamp',
    select : 'name description'
}), getCourses)
.post(protect, authorize('publisher', 'admin'), addCourse);

router.route('/:id')
.get(protect, getCourse)
.put(protect, authorize('publisher', 'admin'), updateCourse);
put(protect, authorize('publisher', 'admin'), deleteCourse);


module.exports = router;