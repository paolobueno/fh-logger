var fs = require('fs');
var fh_logger = require('../lib/fh_logger.js');
/* only using bunyan's contants for levels in assertions */
var bunyan = require('bunyan'); 

exports.test_createLogger_simple = function (test, assert) {
  var config = {name: 'simple'};
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'simple');
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams[0].type, 'stream');
  assert.strictEqual(logger.streams[0].level, bunyan.INFO);
  assert.strictEqual(logger.streams[0].stream, process.stdout);
  test.finish();
}

exports.test_createLogger_config_from_json = function (test, assert) {
  var logFile = './test/test_fh_logger.log';
  var config = {name: 'from_json', streams: [
    {type: 'file', stream: 'file', path: logFile, level: 'info'}
  ]};
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'from_json');
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'file');
  assert.strictEqual(logger.streams[0].level, bunyan.INFO);
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
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'file');
  assert.strictEqual(logger.streams[0].level, bunyan.INFO);
  assert.strictEqual(logger.streams[0].path, logFile);

  logger.info("Dummy log statement");
  fs.readFile(logFile, 'utf-8', function(err, data) {
    assert.ifError(err);
    assert.ok(data);
    deleteFile(logFile);
    test.finish();
  });
}

exports.test_createLogger_config_from_string_stdout = function (test, assert) {
  var logFile = './test/test_fh_logger.log';
  var config = JSON.stringify({name: 'from_string_sdout', streams: [
    {type: 'stream', stream: 'process.stdout', level: 'debug'}
  ]});
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'from_string_sdout');
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'stream');
  assert.strictEqual(logger.streams[0].level, bunyan.DEBUG);
  logger.info("Dummy log statement");
  test.finish();
}

exports.test_createLogger_config_from_string_raw_ringbuffer = function (test, assert) {
  var config = JSON.stringify({name: 'from_string_raw', streams: [
    {type: 'raw', stream: 'ringbuffer', level: 'trace'}
  ]});
  var logger = fh_logger.createLogger(config);
  assert.strictEqual(logger.fields.name, 'from_string_raw');
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'raw');
  assert.strictEqual(logger.streams[0].level, bunyan.TRACE);
  logger.trace("Raw trace log statement");
  var record = logger.streams[0].stream.records[0];
  assert.strictEqual(record.name, 'from_string_raw');
  assert.strictEqual(record.msg, 'Raw trace log statement');
  test.finish();
}

exports.test_createLogger_stream_process_stdout = function (test, assert) {
  var config = {name: 'test_stdout', streams: [{stream: 'process.stdout', type: 'stream'}]};
  var logger = fh_logger.createLogger(JSON.stringify(config));
  assert.strictEqual(logger.fields.name, 'test_stdout');
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].type, 'stream');
  assert.strictEqual(logger.streams[0].level, bunyan.INFO);
  assert.strictEqual(logger.streams[0].stream, process.stdout);
  test.finish();
}

exports.test_createLogger_stream_process_stderr = function (test, assert) {
  var config = {name: 'test_stderr', streams: [{stream: 'process.stderr', type: 'stream'}]};
  var logger = fh_logger.createLogger(JSON.stringify(config));
  assert.strictEqual(logger.fields.name, 'test_stderr');
  assert.isDefined(logger.serializers);
  assert.strictEqual(logger.streams.length, 1);
  assert.strictEqual(logger.streams[0].stream, process.stderr);
  assert.strictEqual(logger.streams[0].level, bunyan.INFO);
  test.finish();
}

exports.test_createLogger_config_from_file = function (test, assert) {
  fs.readFile(__dirname + '/config.json', 'utf-8', function(err, config) {
    assert.ifError(err);
    var logger = fh_logger.createLogger(config);
    assert.strictEqual(logger.fields.name, 'testing');
    assert.isDefined(logger.serializers);
    assert.strictEqual(logger.streams.length, 3);
    assert.strictEqual(logger.streams[0].type, 'file');
    assert.strictEqual(logger.streams[0].level, bunyan.INFO);
    assert.isDefined(logger.streams[0].path);
    assert.strictEqual(logger.streams[1].type, 'stream');
    assert.strictEqual(logger.streams[1].level, bunyan.DEBUG);
    assert.strictEqual(logger.streams[1].stream, process.stdout);
    assert.strictEqual(logger.streams[2].type, 'raw');
    assert.strictEqual(logger.streams[2].level, bunyan.TRACE);

    logger.info("From file config");
    fs.readFile(logger.streams[0].path, 'utf-8', function(err, data) {
      assert.ifError(err);
      assert.ok(data);
      deleteFile(logger.streams[0].path);
      test.finish();
    });
  });
}

var deleteFile = function(file) {
  fs.exists(file, function(exists) {
    if (exists) {
      fs.unlink(file, function(err) {
        if (err.code != 'ENOENT') {
          throw err;
        }
      });
    }
  });
}
