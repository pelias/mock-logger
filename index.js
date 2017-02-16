'use strict';

const _ = require('lodash');

module.exports = () => {
  const levels = {
    error: [],
    warn: [],
    info: [],
    verbose: [],
    debug: [],
    silly: []
  };

  const base = {
    get: (layer) => {
      return {
        error: (msg) => { levels.error.push(msg); },
        warn: (msg) => { levels.warn.push(msg); },
        info: (msg) => { levels.info.push(msg); },
        verbose: (msg) => { levels.verbose.push(msg); },
        debug: (msg) => { levels.debug.push(msg); },
        silly: (msg) => { levels.silly.push(msg); },
        getLayer: () => {
          return layer;
        }
      };
    },
    // return the supported logging levels
    getLevels: () => {
      return Object.keys(levels);
    },
    // get all logged messages at a particular level or all levels
    getMessages: (level, pattern) => {
      if (levels.hasOwnProperty(level)) {
        if (_.isRegExp(pattern)) {
          return levels[level].filter((message) => {
            return message.match(pattern);
          });
        }

        // return a clone so it can't be modified externally
        return levels[level].slice();
      }

      // if no level was specified, return all messages
      if (!level) {
        return _.cloneDeep(levels);
      }

      throw `unsupported log level: ${level}`;
    },
    // return whether there are logged messages at a particular level, optionally matching a pattern
    hasMessages: (level, pattern) => {
      if (levels.hasOwnProperty(level)) {
        if (_.isRegExp(pattern)) {
          return levels[level].filter((message) => {
            return message.match(pattern);
          }).length > 0;
        }

        return levels[level].length > 0;
      }

      throw `unsupported log level: ${level}`;
    }
  };

  // dynamically add functions that log/get/has/is at all levels
  return Object.keys(levels).reduce((acc, level) => {
    // add level-specific getMessages
    // return matching messages if pattern is a regex, otherwise return all
    acc[`get${_.capitalize(level)}Messages`] = (pattern) => {
      if (_.isRegExp(pattern)) {
        return levels[level].filter((message) => {
          return message.match(pattern);
        });
      }

      return levels[level].slice();

    };

    // add level-specific hasMessages with optional pattern
    acc[`has${_.capitalize(level)}Messages`] = (pattern) => {
      if (_.isRegExp(pattern)) {
        return levels[level].some((message) => {
          return message.match(pattern);
        });
      }

      return levels[level].length > 0;
    };

    // add level-specific isMessage
    // match if pattern is a regex, otherwise use equality
    acc[`is${_.capitalize(level)}Message`] = (pattern) => {
      return levels[level].some((message) => {
        return _.isRegExp(pattern) ? message.match(pattern) : message === pattern;
      });

    };

    return acc;

  }, base);

};
