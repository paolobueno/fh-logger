module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    _test_runner: 'whiskey',
    _unit_tests: [
      'test/test_fh_logger.js'
    ],
    _unit_args: '--real-time --report-timing --failfast --timeout 50000 --tests "<%= _unit_tests.join(\' \') %>"',

    // These are the properties that grunt-fh-build will use
    unit: '<%= _test_runner %> <%= _unit_args %>',
    unit_cover: 'istanbul cover --dir cov-unit <%= _test_runner %> -- <%= _unit_args %>'
  });

  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['fh:default']);
};
