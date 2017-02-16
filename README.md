# Pelias Mock Logger


## Functions

* logging events
  * `error(msg)`
  * `warn(msg)`
  * `info(msg)`
  * `verbose(msg)`
  * `debug(msg)`
  * `silly(msg)`
* `getLayer()`
* `getLevels()`
* `getMessages(level)`
* `hasMessages(level)`
* level-specific functions
  * getMessages
    * `getErrorMessages(pattern)`
    * `getWarnMessages(pattern)`
    * `getInfoMessages(pattern)`
    * `getVerboseMessages(pattern)`
    * `getDebugMessages(pattern)`
    * `getSillyMessages(pattern)`
  * hasMessages
    * `hasErrorMessages(pattern)`
    * `hasWarnMessages(pattern)`
    * `hasInfoMessages(pattern)`
    * `hasVerboseMessages(pattern)`
    * `hasDebugMessages(pattern)`
    * `hasSillyMessages(pattern)`
  * isMessage
    * `isErrorMessages(pattern)`
    * `isWarnMessages(pattern)`
    * `isInfoMessages(pattern)`
    * `isVerboseMessages(pattern)`
    * `isDebugMessages(pattern)`
    * `isSillyMessages(pattern)`
