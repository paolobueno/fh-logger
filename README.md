## fh-logger
Enables a simple way of creating [Bunyan]() loggers, configured with request serializers, including clustering information. 

### Install
```shell
npm install fh-logger
```

### Usage
You can configure the logger as you would normally do with Bunyan, for example:
```javascript
var fh_logger = require('fh-logger');
var logger = fh_logger.createLogger({name: 'first'});
```

You can also pass in a JSON string containing you logger configuration. This is useful if you define your logger configuration externally to your code in a .json file.
You might have a configuration that looks something like this:
```json

```


