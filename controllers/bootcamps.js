const path = require('path');
const geocoder = require('../utils/goecoder');
const Bootcamp = require('../models/Bootcamp');

// @desc  Get All Bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getbootcamps = async (req, res, next) => {
    try{
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success : true, count : bootcamps.length, data : bootcamps});
    }catch(err){
        res.status(400).json({success : false});
    }
}

// @desc  Get Single Bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access Public
exports.getbootcamp = async (req, res, next) => {
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return res.status(400).json({success : false});
        }

        res.status(200).json({success : true, data : bootcamp});
    }catch(err){
        res.status(401).json({success : false});
    }
}

// @desc  Create new Bootcamp
// @route  POST /api/v1/bootcamps 
// @access Private
exports.createbootcamp = async (req, res, next) => {

    // Add User to req.body
    req.body.user = req.user.id;

    try{

        // Check for published bootcamp
        const publishedBootCamp = await Bootcamp.findOne({user : req.user.id});

        // If the user is not an admin, they can only add one bootcamp. But if the User is an admin, the user can add as many bootcamps as he wants
        if(publishedBootCamp && req.user.role !== 'admin'){
            return res.status(400).json({success : false, message : `The user ${req.user.id} has already published a bootcamp`});
        }
        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({
            success : true,
            data : bootcamp
        })

    }catch(err){
        res.status(400).json({success : false});
    }
}

// @desc  Update Bootcamp
// @route  PUT /api/v1/bootcamp/:id
// @access Private
exports.Updatebootcamp = async (req, res, next) => {
    
    try{
        let bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return res.status(400).json({success : false});    
        }

        // Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({sucess : false, message : `User ${req.user.id} is not authorized to update this bootcamp`});
        };

        bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        })
        res.status(200).json({success : true, data : bootcamp});

    }catch(err){

        res.status(401).json({success : false});
    }
}

// @desc  Delete Bootcamps
// @route  DELETE /api/v1/bootcamp/:id
// @access Private
exports.deletebootcamps = async (req, res, next) => {
   
    try{
       const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return res.status(400).json({success : false});    
        }

        // Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({sucess : false, message : `User ${req.user.id} is not authorized to Delete this bootcamp`});
        };
        bootcamp.remove();

        res.status(200).json({success : true, data : {}});

    }catch(err){

        res.status(401).json({success : false});
    }
}

// @desc  Get Bootcamps within a radius
// @route  Get /api/v1/bootcamp/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = async (req, res, next) => {
   const {zipcode, distance} = req.params;

   // Get lat/lng from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   // Calc radius using radians
   // Divide distance by radius of Earth
   // Earth radius = 3,963 miles or 6,378 km 
   const radius = distance / 3963 //miles;

   const bootcamps = await Bootcamp.find({
       location : {$geoWithin : {$centerSphere : [[lng, lat], radius]}}
   });
   res.status(200).json({
       success : true,
       count : bootcamps.length,
       data : bootcamps
   })
}

// @desc  Get Bootcamps By Filtering
// @route  Get /api/v1/bootcamp
// @access Private
exports.getbootcampByFiltering = async (req, res, next) => {
    // let query;

    // const reqQuery = {...req.query};
    // // Fields to exclude
    // const removeFields = ['select', 'sort', 'page', 'limit'];

    // // Loop over remove field's array and delete them from req.query;
    // removeFields.forEach(param => delete reqQuery[param]);

    // let queryStr = JSON.stringify(reqQuery);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // query = Bootcamp.find(JSON.parse(queryStr)) 
    // if(req.query.select) {
    //     const fields = req.query.select.split(',').join(' ');   
    //     query = query.select(fields);
    // }

    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // }else{
    //     query = query.sort('-createdAt');
    // }

    // // Pergination
    // const skipPage = parseInt(req.query.page, 10) || 1;
    // const limit = parseInt(req.query.limit, 10) || 1;
    // const startIndex = (skipPage - 1) * limit;
    // const endIndex = skipPage * limit;
    // const total = await Bootcamp.countDocuments();

    // query = query.skip(startIndex).limit(limit);

    // // Execute Query
    // const bootcamp = await query; 

    // const pagination = {};

    // if(endIndex < total){
    //     pagination.next = {
    //         page : skipPage + 1,
    //         limit
    //     }
    // }

    // if(startIndex > 0) {
    //     pagination.prev = {
    //         page : skipPage - 1,
    //         limit
    //     }
    // }

    // res.status(200).json({
    //     success : true,
    //     count : bootcamp.length,
    //     pagination,
    //     data : bootcamp
    // })
    try{
        res.status(200).json(res.advanceResults);
    }catch(err){
        console.log(err);
    }
}

// @desc  Upload photo for bootcamp
// @route  PUT /api/v1/bootcamp/:id/photo
// @access Private
exports.bootcampPhotoUpload = async (req, res, next) => {
   
    try{
       const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return res.status(400).json({success : false});    
        }

        // Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({sucess : false, message : `User ${req.user.id} is not authorized to update this bootcamp`});
        };

        if(!req.files){
            return res.status(400).json({success : false, message : 'Please Upload a file'});
        }

        const file = req.files.file;

        // Make sure that the image is a photo
        if(!file.mimetype.startWith('image')){
            res.status(400).json({message : 'Please upload an image file'});
        }

        // Check File Size
        if(file.size > process.env.MAX_FILE_UPLOAD){
            return res.status(400).json({message : `Upload file that is less than ${process.env.MAX_FILE_UPLOAD}`});
        }

        // Create Custom File name
       file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

       file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.log(err);
            return res. status(500).json({message : 'Problem with file upload'});
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo : file.name});
        res.status(200).json({success : true, data : file.name});
       })

    }catch(err){

        res.status(401).json({success : false});
    }
}