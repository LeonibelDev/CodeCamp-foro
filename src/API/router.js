const express = require('express');
const router = express.Router();
const { getPost, getPostById, getPostLimitResult, getAverage } = require('./response.js');

router.get('/post', getPost);
router.get('/post/id/:id', getPostById);
router.get('/post/limit/:id', getPostLimitResult);
router.get('/post/limit/from/:from/to/:to', getAverage);

module.exports = router;