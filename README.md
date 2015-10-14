## fh-logger
Enables a simple way of configuring and creating [Bunyan](https://github.com/trentm/node-bunyan) loggers, configured with request serializers, including clustering information. 

### Install
```shell
npm install fh-logger
```

### Usage


#### JavaScript object configuration  

```javascript
var fh_logger = require('fh-logger');
var logger = fh_logger.createLogger({name: 'first'});
```
This will produce a Bunyan logger that will have a request serializer, and will log to ```process.stdout```.


#### String configuration
You can pass in a JSON string containing your logger configuration. This is useful if you define your logger configuration externally to your code, for example in a .json file:  

```json
{
  "name": "testing",
  "streams": [{
    "type": "file",
    "stream": "file",
    "path": "/path/to/testing.log",
    "level": "info"
  }, {
    "type": "stream",
    "src": true,
    "level": "trace",
    "stream": "process.stdout"
  }, {
    "type": "raw",
    "src": true,
    "level": "trace"
  }]
}
```
Create the logger passing in the string configuration read from the above file:

```javascript
var fh_logger = require("fh-logger");
var logger = fh_logger.createLogger(stringConfig);
```

### Testing
To run all the tests:

```shell
grunt mochaTest
```


