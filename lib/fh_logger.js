var bunyan = require('bunyan');
var cluster = require('cluster');

module.exports.createLogger = function(loggerConfig) {
  var config = parseConfig(loggerConfig);
  configureStreams(config);
  configureSerializers(config);
  return bunyan.createLogger(config);
}

function parseConfig(loggerConfig) {
  return typeof loggerConfig === 'string' ? JSON.parse(loggerConfig) : loggerConfig;
}

function configureStreams(config) {
  if (config.streams) {
    var len = config.streams.length;
    for (var i = 0; i < len; i++) {
      var stream = config.streams[i];
      switch (stream.type) {
        case 'raw':
          stream.stream = new bunyan.RingBuffer({
            limit: config.ringBufferLimit || 200
          });
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
              stream.stream = eval(stream.stream);
          }
          break;
        case 'file':
          stream.stream = stream.file;
          break;
      }
    }
  }
}

function configureSerializers(config) {
  config.serializers = {
    req: requestSerializer
  };
}

var requestSerializer = function(req) {
  if (req) {
    return {
      reqId: req.id,
      method: req.method,
      url: req.url,
      worker: cluster.worker? cluster.worker.id: -1
    }
  }
  return {}
}
