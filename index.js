const _ = require('lodash');

module.exports = () => {
  // initialize arrays for all levels
  const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'].reduce((acc, level) => {
    return _.set(acc, level, []);
  }, {});

  // establish the base functions
  const base = {
    get: (layer) => {
      // add error(msg), info(msg), etc to getLayer() to form logger functionality
      return Object.keys(levels).reduce((acc, level) => {
        return _.set(acc, level, msg => levels[level].push(msg));
      }, { getLayer: () => layer } );
    },
    // return the supported logging levels
    getLevels: () => Object.keys(levels),
    // get all logged messages at a particular level or all levels
    getMessages: (level, pattern) => {
      if (levels.hasOwnProperty(level)) {
        if (_.isRegExp(pattern)) {
          return levels[level].filter(message => message.match(pattern));
        }

        // return a clone so it can't be modified externally
        return _.cloneDeep(levels[level]);
      }

      // if no level was specified, return all messages
      if (!level) {
        return _.cloneDeep(levels);
      }

      throw `unsupported log level: ${level}`;
    },
    isMessage: (level, pattern) => {
      if (levels.hasOwnProperty(level)) {
        if (_.isRegExp(pattern) || _.isString(pattern)) {
          return levels[level].some(message =>
            _.isRegExp(pattern) ? message.match(pattern) : message === pattern);
        }

        throw 'pattern must be a regexp or string';
      }

      throw `unsupported log level: ${level}`;
    }
  };

  // return whether there are logged messages at a particular level, optionally matching a pattern
  base.hasMessages = (level, pattern) => !_.isEmpty(base.getMessages(level, pattern));

  // dynamically add getErrorMessages(), hasErrorMessages(), isErrorMessage(), etc.
  return Object.keys(levels).reduce((acc, level) => {
    acc[`get${_.capitalize(level)}Messages`] = acc.getMessages.bind(null, level);
    acc[`has${_.capitalize(level)}Messages`] = acc.hasMessages.bind(null, level);
    acc[`is${_.capitalize(level)}Message`] = acc.isMessage.bind(null, level);
    return acc;
  }, base);

};
