var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var Promise = require('bluebird');
var path = require('path');
var glob = require('glob');
var fs=require('fs');
var Redis = require('ioredis');
var redis = new Redis({password: process.env.REDISPASSWORD}); //Need to set pass and other settings
var crypto = require('crypto');
var Cookies = require('cookies');
var Keygrip = require("keygrip");
var keylist=["SEKRIT2", "SEKRIT1"];
var keys = new Keygrip(keylist,'sha256','hex')

/* GET home page. */
router.get('/', function(req, res, next) {
  var cookies = new Cookies( req, res, { "keys": keys } ), unsigned, signed, tampered;
  cookies.set( "unsigned", "foo").set( "signedCookie", "bar", { signed: true } );  

  unsigned = cookies.get( "unsigned" )
  signed = cookies.get( "signed", { signed: true } )
  tampered = cookies.get( "tampered", { signed: true } )


  var base_path = "/home/brunocosta/Documentos/*";
    // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)


  function list(path){
    return new Promise(function(resolve, reject){
      glob(path,function(err,result){
        //If no stderr furfill promise else send stdr;
        err===null ? resolve(result) : reject(err);
      });
    });  
  }
  list(base_path).then(function(data){

    var dirs=[];
    var files=[];
    for( i in data){
      var base = path.basename(data[i]);
      fs.lstatSync(data[i]).isDirectory() ? dirs.push(base) : files.push(base);
    }
    res.render('index', {title:"genURL",origin:path.dirname(base_path),dirs,files});
  });

});

router.post('/ls', function(req, res, next) {
  var list_path = req.body.path;
  var up = req.body.up;

  console.log(list_path);

  up ? list_path=path.dirname(list_path)+"/*" : list_path=list_path+"/*" ;
  
  
  
  function list(path){
    return new Promise(function(resolve, reject){
      glob(path,function(err,result){
        //If no stderr furfill promise else send stdr;
        console.log(result);
        err===null ? resolve(result) : reject(err);
      });
    });  
  }
 
  list(list_path).then(function(data){
    var dirs=[];
    var files=[];
    for( i in data){
      var base = path.basename(data[i]);
      fs.lstatSync(data[i]).isDirectory() ? dirs.push(base) : files.push(base);
    }
    res.json({origin:path.dirname(list_path),dirs,files});
  });
 
});

router.post('/share', function(req,res,next){
  //Vulnerable any body can send to the server. Must request rotating api key (Time based).
  //receives that absolute path. Sends the link

  var file_path=req.body.path
  var auth=req.body.auth; //No used yet.
  auth="1q2222222342we3we";  //ATTENTION ! To change, drastically.
  if( auth=== "1q2222222342we3we" ){
    var hash=crypto.createHash('md5').update(file_path).digest('hex')  
    redis.set(hash,file_path);
    res.json({link:req.headers.host+"/files/"+hash})
  }else{
    res.render('503');
  }

});

module.exports = router;
