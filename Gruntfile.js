module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    mochaTest: {
      all: ['./test/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['mochaTest', 'fh:default']);
};
