const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc  Get Courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = async (req, res, next) => {
   
    try{
        if(req.params.bootcampId) {
            const courses = await Course.find({bootcamp : req.params.bootcampId});
            return res.status(200).json({
                success : true,
                count : courses.length,
                data : courses
            })
        }else {
            //query = Course.find().populate('bootcamp'); ===> This is when you want to populate the bootcamp field in the "Course" model with all the fields from the "Bootcamp" model
            // query = Course.find().populate({
            //     path : 'bootcamp',
            //     select : 'name description'
            // });  //==> this is when you want to populate the bootcamp field in the "Course" model with specific fields(name and description) from the "Bootcamp" model
        }

        res.status(200).json(res.advancedResult);

    }catch(err){
        console.log(err);
    }
}

// @desc  Get Single Course
// @route  GET /api/v1/courses/:id
// @access Public
exports.getCourse = async (req, res, next) => {
   
    try{
        const course = await Course.findById(req.params.id).populate({
            path : 'bootcamp',
            select : 'name description'
        })
            if(!course){
                return res.status(404).json({Error : `No course with id of  ${req.params.bootcampId}`});
            }

        res.status(200).json({
            success : true,
            data : course
        })

    }catch(err){
        console.log(err);
    }
}

// @desc  Add Course
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    try{
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
            if(!bootcamp){
                return res.status(404).json({Error : `No course with id of  ${req.user.bootcampId}`});
            }

            // Make sure user is the course owner
            if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
                return res.status(401).json({sucess : false, message : `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`});
            };

            const course = await Course.create(req.body);

        res.status(200).json({
            success : true,
            data : course
        })

    }catch(err){
        console.log(err);
    }
}

// @desc  Update Course
// @route  PUT /api/v1//courses/:id
// @access Private
exports.updateCourse = async (req, res, next) => {

    try{
        let course = await Course.findById(req.params.id);
            if(!course){
                return res.status(404).json({Error : `No course with id of ${req.params.id}`});
            }

            // Make sure user is the course owner
            if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
                return res.status(401).json({sucess : false, message : `User ${req.user.id} is not authorized to update course ${course._id}`});
            };

            course = await course.findByIdAndUpdate(req.params.id, req.body, {
                new : true,
                runValidate : true
            });

        res.status(200).json({
            success : true,
            data : course
        })

    }catch(err){
        console.log(err);
    }
}

// @desc  Delete Course
// @route  DELETE /api/v1//courses/:id
// @access Private
exports.deleteCourse = async (req, res, next) => {

    try{
        const course = await Course.findById(req.params.id);
            if(!course){
                return res.status(404).json({Error : `No course with id of  ${req.params.id}`});
            }

            // Make sure user is the course owner
            if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
                return res.status(401).json({sucess : false, message : `User ${req.user.id} is not authorized to update this bootcamp`});
            };

            await course.remove();

        res.status(200).json({
            success : true,
            data : {}
        })

    }catch(err){
        console.log(err);
    }
}
