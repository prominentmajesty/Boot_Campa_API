// @desc  Get All Bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getbootcamps = (req, res, next) => {
    res.status(200).json({success : true, msg : 'Show all Bootcamps'});
}

// @desc  Get Single Bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access Public
exports.getbootcamp = (req, res, next) => {
    res.status(200).json({success : true, msg : 'Get Single Bootcamp'});
}

// @desc  Create new Bootcamp
// @route  POST /api/v1/bootcamps 
// @access Private
exports.createbootcamp = (req, res, next) => {
    res.status(200).json({success : true, msg : 'Create new Bootcamp'});
}

// @desc  Update Bootcamp
// @route  PUT /api/v1/bootcamp/:id
// @access Private
exports.Updatebootcamp = (req, res, next) => {
    res.status(200).json({success : true, msg : 'Update Bootcamp'});
}

// @desc  Delete Bootcamps
// @route  DELETE /api/v1/bootcamp/:id
// @access Private
exports.deletebootcamps = (req, res, next) => {
    res.status(200).json({success : true, msg : 'Delete Bootcamps'});
}