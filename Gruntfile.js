module.exports = function(grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-requirejs');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!\n' +
              ' * Paper Plane\n' +
              ' * built: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' * http://11am.github.com/paper-plane\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
              ' * Arne Schlüter; Licensed MIT\n' +
              '!*/\n\n'
    },
    watch: {
      files: 'src/js/*.js',
      tasks: 'dev'
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        laxcomma: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        debug: true,
        globals: {
          CodeMirror: true,
          paper: true,
          console: true,
          module: true
        }
      },
    },
    concat: {
      options: {
        separator: ';',
        banner: '<%= meta.banner %>'
      },
      build: {
        src: [ 'src/js/*.js' ],
        dest: 'www/js/built.js'
      }
    },
    cssmin: {
      build: {
        files: {
          'www/css/style.css': [ 'src/css/*.css' ]
        }
      }
    },
    copy: {
      vendor: {
        expand: true,
        cwd: 'src/js/vendor',
        src: ['**'],
        dest: 'www/js/vendor/'
      },
      modules: {
        expand: true,
        cwd: 'src/js/module',
        src: ['**'],
        dest: 'www/js/module'
      }
    },
    requirejs: {
      build: {
        options: {
          baseUrl: 'src/js',
          name: 'app',
          out: 'www/js/main.js',
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          useSourceUrl: true,
          shim: {
            'vendor/codemirror': {
              exports: 'CodeMirror'
            },
            'vendor/paper': {
              exports: 'paper'
            }
          }
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('dev', [ 'cssmin', 'copy', 'requirejs' ] )
  grunt.registerTask('default', [ 'jshint', 'cssmin', 'copy', 'concat' ]);

};
