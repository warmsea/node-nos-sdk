/**
 * @copyright 2014 Su Su
 * @author Su Su <s@warmsea.net>
 */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsonlint: {
      src: ['*.json', 'lib/**/*.json', 'test/**/*.json']
    },
    jscs: {
      src: ['*.js', 'lib/**/*.js', 'test/*.js', 'test/**/*.js'],
      options: {
        config: '.jscs.json'
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      src: {
        files: {
          src: ['*.js', 'lib/**/*.js', 'test/**/*.js']
        }
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        clearRequireCache: true
      },
      service: {
        src: ['test/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', [
    'jsonlint',
    'jscs',
    'jshint:src',
    'mochaTest:service'
  ]);

  grunt.registerTask('test', [
    'mochaTest:service'
  ]);

};
