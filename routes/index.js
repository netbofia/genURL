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
var token="qawsaffsfkjahf3728fh93qo38gfwqig3qq82gdq93yd9wqd39qdxeaiwhah";

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.headers.host=="obanheiro.pt") {
    res.render('obanheiro');
  }

  var cookies = new Cookies( req, res, { "keys": keys } ), unsigned, signed, tampered;
  //cookies.set( "access", "qawsaffsfkjahf3728fh93qo38gfwqig3qq82gdq93yd9wqd39qdxeaiwhah").set( "apikey", token, { signed: true, maxAge: (1000 * 60 * 60 * 30 * 12) } );  

  unsigned = cookies.get( "unsigned" )
  signed = cookies.get( "signed", { signed: true } )
  tampered = cookies.get( "tampered", { signed: true } )


  var base_path =  process.env.BASEPATH || "/home/brunocosta/Documentos/*";
  var nav = base_path.replace("*","").replace(/^\//,"").replace(/\/$/,"").split("/")
  var navPaths = {}
  var tempPath="";
  for(i in nav){
    tempPath+="/"+nav[i];
    navPaths[nav[i]]=tempPath;
  } 
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
      //Get oath base name
      var base = path.basename(data[i]);
      //Check weather path is dir or file
      fs.lstatSync(data[i]).isDirectory() ? dirs.push(base) : files.push(base);
    }
    req.cookies.apikey==token ? res.render('index', {title:"genURL",origin:path.dirname(base_path),dirs,files,nav,navPaths}) : res.sendStatus(404);
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
    res.json({origin:path.dirname(list_path),dirs,files})
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
    res.render('404');
  }

});

router.get('/permissions', function(req, res, next) {
  var cookies = new Cookies( req, res, { "keys": keys } ), unsigned, signed, tampered;
  //cookies.set( "access", "qawsaffsfkjahf3728fh93qo38gfwqig3qq82gdq93yd9wqd39qdxeaiwhah").set( "apikey", token, { signed: true } );  

  unsigned = cookies.get( "unsigned" )
  signed = cookies.get( "signed", { signed: true } )
  tampered = cookies.get( "tampered", { signed: true } )

  /* GET users listing. */

  redis.keys("*").then(function(hashList){
    redis.mget(hashList).then(function(hashValues){
      var files={};
      for(i in hashValues){
        files[hashList[i]]=path.basename(hashValues[i]);
      }
      req.cookies.apikey==token ? res.render('permissions', {files} ) : res.sendStatus(504);
    });
    //res.download(result);
  })
});


router.post('/delete',function(req, res, next){
  var hash=req.body.hash
  redis.del(hash);
  res.sendStatus(200);
})


module.exports = router;
