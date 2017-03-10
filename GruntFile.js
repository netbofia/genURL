/*!
 * Bruno Costa 
 * 
 * 
 * 
 */
//NEED TO BUILD IT FIRST possibly
var path=require('path')
var bowerGoodies="bower_components/bower_components.json";  
var sass=require('node-sass');



module.exports = function (grunt) {

  grunt.initConfig({

    run: function(){
      //Ensures that file exists so it don't cause a havik.
      grunt.file.exists(bowerGoodies) ? '' : grunt.file.write(bowerGoodies,"{}");
    }(),
    pkg: grunt.file.readJSON(bowerGoodies),
    copy: {
       all: {
        files: [
          //Dealing with lack of files for css etc.
          {src: ['<%= pkg.js %>'], dest: 'public/javascripts/'},
          {src: ['<%= pkg.css %>'], dest: 'public/stylesheets/'},
        ]
      }
    },
    //also no used shame had to build all of them.
    bower: {
      dev: {
        dest: 'public/',
        js_dest: 'public/js',
        css_dest: 'public/styles'
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-bower')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  //Need to set it to wait before starting copy 
  grunt.registerTask('default', ['list','make:css','clean','copy','build'])

  grunt.registerTask('list',function(){
    //Creates the JSON with all the relevant path in bower_components
    var bower_components={};

    var glob=require('glob').sync;  //change this later to async
    var bowerPKGs=glob('bower_components/*/bower.json');
    for(i in bowerPKGs){
      component=path.dirname(bowerPKGs[i]);
      var bowerFiles=grunt.file.readJSON(bowerPKGs[i]).main; 
      typeof bowerFiles == "string" ? bowerFiles=[bowerFiles] : bowerFiles=bowerFiles
      for(y in bowerFiles){
        var bowerFile=bowerFiles[y];
        var ext_now=path.extname(bowerFile).replace(".","");
        if(ext_now in bower_components){
          bower_components[ext_now].push(path.join(component,bowerFile));
        }else{
          bower_components[ext_now]=[path.join(component,bowerFile)];
        }
      } 
    }
    grunt.file.write(bowerGoodies,JSON.stringify(bower_components))
  })

  grunt.registerTask('build',function(){
      //Test file for building
      var jade=grunt.file.read('views/layout.pug')
      var bowerFiles=grunt.file.readJSON(bowerGoodies)

      //console.log(jade);
      console.log(jade.match(/.*\<\!-- bower\:css --\>/g));
  })

  grunt.registerTask('clean:js',function(){
      //removes links from <!-- bower:scss -->
      //                   <!-- endbower -->
      var filepath='views/layout.pug';
      var jade=grunt.file.read(filepath)
      prefix_js=jade.match(/.*\<\!-- bower\:js --\>/g)[0].replace("<!-- bower:js -->","");
      grunt.file.write(filepath,jade.replace(/\<\!-- bower\:js --\>\n(.*script.*\n)*.*\<\!-- endbower --\>/g,"<!-- bower:js -->\n"+prefix_js+"<!-- endbower -->"));
  })

  grunt.registerTask('clean:css',function(){
    //removes scripts from <!-- bower:js -->
    //                     <!-- endbower -->
    var filepath='views/layout.pug';
    var jade=grunt.file.read(filepath);
    prefix_css=jade.match(/.*\<\!-- bower\:css --\>/g)[0].replace("<!-- bower:css -->","");
    grunt.file.write(filepath,jade.replace(/\<\!-- bower\:css --\>\n(.*link.*\n)*.*\<\!-- endbower --\>/g,"<!-- bower:css -->\n"+prefix_css+"<!-- endbower -->"));
  })

  //Clean js and css
  grunt.registerTask('clean',['clean:js','clean:css'])  
 
  grunt.registerTask('build:js',function(){
    var js_dest="/javascripts/"
    var template='script(src="@")'
    var filepath='views/layout.pug';

    var jade=grunt.file.read(filepath);
    var bowerFiles=grunt.file.readJSON(bowerGoodies)
    prefix_js=jade.match(/.*\<\!-- bower\:js --\>/g)[0].replace("<!-- bower:js -->","");
    for(i in bowerFiles.js){
      var script=prefix_js+template.replace("@",js_dest+bowerFiles.js[i]);
      jade=jade.replace(/\<\!-- bower\:js --\>\n/,"<!-- bower:js -->\n"+script+"\n")
    }
    grunt.file.write(filepath,jade);
  })

  grunt.registerTask('build:css',function(){
    var css_dest="/stylesheets/"
    var template="link(rel='stylesheet', href='@')"
    var filepath='views/layout.pug';

    var jade=grunt.file.read(filepath);
    var bowerFiles=grunt.file.readJSON(bowerGoodies)
    prefix_css=jade.match(/.*\<\!-- bower\:css --\>/g)[0].replace("<!-- bower:css -->","");
    for(i in bowerFiles.css){
      var link=prefix_css+template.replace("@",css_dest+bowerFiles.css[i]);
      jade=jade.replace(/\<\!-- bower\:css --\>\n/,"<!-- bower:css -->\n"+link+"\n")
    }
    grunt.file.write(filepath,jade);
  })

  grunt.registerTask('build',['build:js','build:css']);

  grunt.registerTask('make:css',function(){
    /**
    *
    * Description: Converts all scss files in Bower_components to css.
    * 
    *
    */
    bowerFiles=grunt.file.readJSON(bowerGoodies);
    sass_array=bowerFiles.scss;
    for( i in sass_array){
        var scss_filename=sass_array[i];  
        var css_filename=scss_filename.replace(/\.scss$/,".css")
        var result=sass.renderSync({
          file: scss_filename
             //ref for maps
        })//,function(err, result) { 
        bowerFiles.css ? ( bowerFiles.css.indexOf(css_filename)==-1 ? bowerFiles.css.push(css_filename) : '' ) : bowerFiles['css']=[css_filename];
        grunt.file.write(css_filename,result.css);
        console.log(path.basename(css_filename)+" created.")
    }
    var stringBowerFiles=JSON.stringify(bowerFiles);
    grunt.file.write(bowerGoodies,stringBowerFiles); //Either this of make a promise so that it writes only when all are converted. !!Should be improved in the future

  })

}