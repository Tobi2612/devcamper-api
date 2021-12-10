const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


//@desc      get all bootcamps
//@path      GET api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler( async (req, res, next) =>{

    const bootcamps = await Bootcamp.find();

    if(!bootcamps) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({success:true, count:bootcamps.length, data:bootcamps});
});

//@desc      get single bootcamp
//@path      GET api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler( async (req, res, next) =>{

    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({success:true, data:bootcamp});
    
})

//@desc      create bootcamps
//@path      POST api/v1/bootcamps
//@access    Private
exports.createBootcamp = asyncHandler( async (req, res, next) =>{

    const bootcamp = await Bootcamp.create(req.body) ;
    res.status(201).json({success: true, data:bootcamp});
    
})

//@desc      update bootcamps
//@path      PUT api/v1/bootcamps/:id
//@access    Private
exports.updateBootcamp = asyncHandler( async (req, res, next) =>{
    
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true
    });

    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({success: true, data:bootcamp});

})

//@desc      delete bootcamp
//@path      DELETE api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = asyncHandler( async (req, res, next) =>{
   
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    bootcamp.remove();

    res.status(200).json({success:true, data:{}})

})


