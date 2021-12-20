const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');


//@desc      get all bootcamps
//@path      GET api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    //copy req.query
    const reqQuery = { ...req.query };

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removefields and delete from req.query
    removeFields.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators ( $gt,$gte...)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //finding resources
    query = Bootcamp.find(JSON.parse(queryStr));

    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();



    query = query.skip(startIndex).limit(limit);

    const bootcamps = await query;

    //pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    if (!bootcamps) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

//@desc      get single bootcamp
//@path      GET api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({ success: true, data: bootcamp });

})

//@desc      create bootcamps
//@path      POST api/v1/bootcamps
//@access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });

})

//@desc      update bootcamps
//@path      PUT api/v1/bootcamps/:id
//@access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({ success: true, data: bootcamp });

})

//@desc      delete bootcamp
//@path      DELETE api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404))
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} })

})


//@desc      Get bootcamp within a radius
//@path      GET api/v1/bootcamps/radius/:zipcode/:distance
//@access    Public
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;

    //get lat/long from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //clac radius using radians
    //divide dist by radius of earth
    //earth rad = 3963mi / 6378km

    const radius = distance / 6378;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})


