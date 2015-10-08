var fs = require('fs');
var fh_logger = require('../lib/fh_logger.js');

exports.test_createLogger_simple = function (test, assert) {
  var config = {name: 'simple'};
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'simple');
  test.finish();
}

exports.test_createLogger_config_from_json = function (test, assert) {
  var logFile = './test/test_fh_logger.log';
  var config = {name: 'from_json', streams: [
    {type: 'file', stream: 'file', path: logFile, level: 'info'}
  ]};
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'from_json');
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'file');
  assert.strictEqual(logger.streams[0].path, logFile);
  test.finish();
}

exports.test_createLogger_config_from_string = function (test, assert) {
  var logFile = './test/test_fh_logger.log';
  var config = JSON.stringify({name: 'from_string', streams: [
    {type: 'file', stream: 'file', path: logFile, level: 'info'}
  ]});
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'from_string');
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'file');
  assert.strictEqual(logger.streams[0].path, logFile);

  logger.info("Dummy log statement");
  fs.readFile(logFile, 'utf-8', function(err, data) {
    if (err) {
      throw err;
    }
    assert.ok(data);
    deleteFile(logFile);
    test.finish();
  });
}

exports.test_createLogger_stream_process_stdout = function (test, assert) {
  var config = {name: 'test_stdout', streams: [{stream: 'process.stdout', type: 'stream'}]};
  var logger = fh_logger.createLogger(JSON.stringify(config));
  assert.strictEqual(logger.fields.name, 'test_stdout');
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'stream');
  assert.strictEqual(logger.streams[0].stream, process.stdout);
  test.finish();
}

exports.test_createLogger_stream_process_stderr = function (test, assert) {
  var config = {name: 'test_stderr', streams: [{stream: 'process.stderr', type: 'stream'}]};
  var logger = fh_logger.createLogger(JSON.stringify(config));
  assert.strictEqual(logger.fields.name, 'test_stderr');
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].stream, process.stderr);
  test.finish();
}

var deleteFile = function(file) {
  fs.exists(file, function(exists) {
    if (exists) {
      fs.unlink(file, function(err) {
        if (err.code != 'ENOENT') {
          console.log(err);
        }
      });
    }
  });
}
