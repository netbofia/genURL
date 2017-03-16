var express = require('express');
var router = express.Router();
var Redis = require('ioredis');
var redis = new Redis({password: process.env.REDISPASSWORD});

/* GET users listing. */
router.get('/:hash*', function(req, res, next) {
  var hash=req.params.hash;
  redis.get(hash).then(function(result){
  	console.log(result);
  	res.download(result);
  })
});



module.exports = router;
