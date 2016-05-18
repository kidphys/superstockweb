module.exports = function(grunt) {

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Configure Grunt
  grunt.initConfig({

    // babel: {
    //   options: {
    //     sourceMap: true,
    //     presets: ['es2015', 'react']
    //   },
    //   dist: {
    //     files: {
    //       'public/js/superstock_bundle.js': 'superstock.js'
    //     }
    //   }
    // },

    browserify:
    {
        dist: {
          options: {
           transform: [['babelify', {presets: ['es2015', 'react']}]]
        },
        src: ['./superstock.js'],
        dest: 'public/js/superstock_bundle.js',
      }
    },

    // grunt-contrib-connect will serve the files of the project
    // on specified port and hostname
    connect: {
      all: {options:{
          port: 9000,
          hostname: "0.0.0.0",
          // Prevents Grunt to close just after the task (starting the server) completes
          // This will be removed later as `watch` will take care of that
          // keepalive: true,

          // Livereload needs connect to insert a cJavascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {

            return [

              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,

              // Serve the project folder
              connect.static(options.base)
            ];
          },

        }
      }
    },

    watch: {
      scripts: {
        files: '**/*.js',
        tasks: 'browserify',
        options: {
          livereload: true,
        }
      }
    },

    regarde: {
        all: {
        // This'll just watch the index.html file, you could add **/*.js or **/*.css
        // to watch Javascript and CSS files too.
        files:['*.html', 'superstock.js'],
        // This configures the task that will run when the file change
        tasks: ['browserify', 'livereload']
        }
    }
  });

  grunt.registerTask('server',[
    'livereload-start',
    'connect',
    'regarde',
  ]);
};
