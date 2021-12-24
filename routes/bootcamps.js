const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius
} = require('../controllers/bootcamps');

//include other resource routers

const courseRouter = require('./courses');

//reroute into other resources
router.use('/:bootcamId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampInRadius);

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

module.exports = router
