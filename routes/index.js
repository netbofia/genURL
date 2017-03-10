var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var Promise = require('bluebird');

/* GET home page. */
router.get('/', function(req, res, next) {
	  //exec command and get promise
  function send(command){
    return new Promise(function(resolve, reject){
      exec(command, function(error,stdout,stderr){  
        //If no stderr furfill promise else send stdr;
        stderr.length==0 || error===null ? resolve(stdout) : reject({error:error,stderr:stderr});
        //Implement error....... !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      });
    });  
  }

  command="ls .";
  send(command).then(function(data){
    var list={};
    try{
      workdirs=data.trim().split(/\r?\n|\r/g);
      function configParseToJSON(item){
        item.startsWith('#') ? "" :  config[item.split('=')[0]]=btoa(item.split('=')[1]);  
      }
      //workdirs.filter(configParseToJSON);


    }catch(exception){ 
      console.trace(exception);
      config={};
    }finally{
      res.render('index', {workdirs});
    }
  },function(err){
    //If promise isn't fullfilled issue error but render page. Set config to ""
    console.error("Error at index.js - "+err.stderr);
    process.env.LOG>4 ? console.error("Error at index.js - "+err.stderr) : "";
    var config={};
    res.render('index', {title: 'error'});
  });





  
});

module.exports = router;
