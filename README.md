# Pelias Mock Logger

This module is used for testing logging events in Pelias projects.  [proxyquire](https://www.npmjs.com/package/proxyquire)
is the supported module for overriding dependencies in which this module is used.  

## Installation

```bash
$ npm install pelias-mock-logger --save-dev
```

[![NPM](https://nodei.co/npm/pelias-mock-logger.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-mock-logger)

## Usage

Traditionally, testing logging events required quite a bit of setup with proxyquire:

```javascript
const errorMessages = [];

var service = proxyquire('../../../service/interpolation', {
  'pelias-logger': {
    get: () => {
      return {
        error: (msg) => { errorMessages.push(msg); },
        info: (msg) => {}
      };
    }
  }
}).search();

t.deepEquals(errorMessages, ['RequireTransport: failed to connect to interpolation service']);
```

Using the `pelias-mock-logger` module, this code can be shortened to:

```javascript
const logger = require('pelias-mock-logger')();

var adapter = proxyquire('../../../service/interpolation', {
  'pelias-logger': logger
}).search();

t.deepEquals(logger.getErrorMessages(), ['RequireTransport: failed to connect to interpolation service']);
```

## Functions

* logging events
  * `error(msg)`
  * `warn(msg)`
  * `info(msg)`
  * `verbose(msg)`
  * `debug(msg)`
  * `silly(msg)`
* `getLayer()`: returns the value passed to `.get()` in `require( 'pelias-logger' ).get( 'api' )`
* `getLevels()`: returns the supported logging levels: `error`, `warn`, `info`, `verbose`, `debug`, and `silly`
* `getMessages(level, pattern)`: returns all messages logged at a level, optionally matching a pattern
  * Examples:
    * `getMessages('error')`
    * `getMessages('error', /backend error occurred/)`
* `hasMessages(level, pattern)`: returns whether messages were logged at a level, optionally matching a pattern
  * Examples:
    * `hasMessages('error')`
    * `hasMessages('error', /backend error occurred/)`
* `isMessage(level, pattern)`: returns whether the supplied pattern matches or is equal to any messages logged at the specified level
  * Examples
    * `isMessage('error', /backend error occurred)`
    * `isMessage('error', 'a backend error occurred, contact the Pelias team for assistance')`
* level-specific functions
  * getMessages: returns all messages logged at the level specified in function name, optionally matching a pattern
    * `getErrorMessages(pattern)`
    * `getWarnMessages(pattern)`
    * `getInfoMessages(pattern)`
    * `getVerboseMessages(pattern)`
    * `getDebugMessages(pattern)`
    * `getSillyMessages(pattern)`
  * hasMessages: returns whether messages were logged at the level specified in function name, optionally matching a pattern
    * `hasErrorMessages(pattern)`
    * `hasWarnMessages(pattern)`
    * `hasInfoMessages(pattern)`
    * `hasVerboseMessages(pattern)`
    * `hasDebugMessages(pattern)`
    * `hasSillyMessages(pattern)`
  * isMessage: returns whether the supplied pattern matches or is equal to any messages logged at the level specified in the function name
    * `isErrorMessages(pattern)`
    * `isWarnMessages(pattern)`
    * `isInfoMessages(pattern)`
    * `isVerboseMessages(pattern)`
    * `isDebugMessages(pattern)`
    * `isSillyMessages(pattern)`

## NPM Module

The `pelias-mock-logger` npm module can be found here:

[https://npmjs.org/package/pelias-mock-logger](https://npmjs.org/package/pelias-mock-logger)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```
