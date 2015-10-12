module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    // These are the properties that grunt-fh-build will use
    //unit: '<%= _test_runner %> <%= _unit_args %>',
    //unit_cover: 'istanbul cover --dir cov-unit <%= _test_runner %> -- <%= _unit_args %>',
    mochaTest: {
      all: ['./test/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['fh:default']);
  grunt.registerTask('default', ['mochaTest', 'fh:default']);
};
