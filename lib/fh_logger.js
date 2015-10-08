var bunyan = require('bunyan');
/* jshint ignore:start */
var cluster = require('cluster'); 
/* jshint ignore:end */

/* jshint ignore:start */
var requestSerializer = function(req) { 
  function reqSerializer(req) { 
    if(req) {
      return {
        reqId: req.id,
        method: req.method,
        url: req.url,
        worker: cluster.worker? cluster.worker.id: -1
      }
    } else {
      return {}
    }
  }
}
/* jshint ignore:end */

module.exports.createLogger = function(loggerConfig) {
  var config = typeof loggerConfig === 'string' ? JSON.parse(loggerConfig) : loggerConfig;
  var ringBufferLimit = loggerConfig.ringBufferLimit || 200;
  var ringBuffer = new bunyan.RingBuffer({
    limit: ringBufferLimit
  });
  // Iterate through our streams and set accordingly
  if (config.streams) {
    for (var i = 0; i < config.streams.length; i++) {
      var stream = config.streams[i];
      switch (stream.type) {
        case 'raw':
          stream.stream = ringBuffer;
          break;
        case 'stream':
          switch (stream.stream) {
            case 'process.stdout':
              stream.stream = process.stdout;
              break;
            case 'process.stderr':
              stream.stream = process.stderr;
              break;
            default:
              stream.stream = eval(stream.stream); // jshint ignore:line
          }
          break;
        case 'file':
          stream.stream = eval(stream.file);
          break;
      }
    }
  }
  config.serializers = {
    req: requestSerializer
  };
  return bunyan.createLogger(config);
}

