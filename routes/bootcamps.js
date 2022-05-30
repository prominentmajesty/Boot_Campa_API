const express = require('express');
const { 
    getbootcamps,
    getbootcamp ,
    createbootcamp,
    Updatebootcamp,
    deletebootcamps
} = require('../controllers/bootcamps');

const router = express.Router();

router
    .route('/')
    .get(getbootcamps)
    .post(createbootcamp);

router
    .route('/:id')
    .get(getbootcamp)
    .put(Updatebootcamp)
    .delete(deletebootcamps);


module.exports = router;