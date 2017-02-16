'use strict';

const test = require('tape').test;
const _ = require('lodash');

test('getLayer should return the layer use in constructor', (t) => {
  const logger = require('../index')().get('layer value');

  t.equals(logger.getLayer(), 'layer value');
  t.end();

});

test('getLevels should return all known levels', (t) => {
  const rootLogger = require('../index')();

  t.deepEquals(rootLogger.getLevels(), ['error', 'warn', 'info', 'verbose', 'debug', 'silly']);
  t.end();

});

test('all levels should initially be empty', (t) => {
  const rootLogger = require('../index')();

  rootLogger.getLevels().forEach((level) => {
    t.deepEquals(rootLogger.getMessages(level), [], `level ${level} should initially be empty`);
  });

  t.end();

});

// TESTS FOR GET
test('getMessages should return all messages logged at the specified level', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    const expected = [`${level} message 1`, `${level} message 2`];

    expected.forEach((message) => {
      logger[level](message);
    });

    const actual1 = rootLogger.getMessages(level);
    const actual2 = rootLogger[`get${_.capitalize(level)}Messages`]();

    t.deepEquals(actual1, expected, `all ${level} messages should have been returned`);
    t.deepEquals(actual2, expected, `all ${level} messages should have been returned`);

    // modify the returned arrays to show that internally nothing has changed
    actual1.push(`${level} message 3`);
    actual1[0] = `new ${level} message 1`;
    actual2.push(`${level} message 3`);
    actual2[0] = `new ${level} message 1`;

    t.deepEquals(rootLogger.getMessages(level), expected, `${level} messages should not be modified`);
    t.deepEquals(rootLogger[`get${_.capitalize(level)}Messages`](), expected, `${level} messages should not be modified`);

  });

  t.end();

});

test('getMessages with pattern should return matching messages at supplied level', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    const expected = [`${level} message 1`, `${level} message 2`];

    expected.forEach((message) => {
      logger[level](message);
    });

    const actual1 = rootLogger.getMessages(level, / 2$/);
    const actual2 = rootLogger[`get${_.capitalize(level)}Messages`](/ 2/);

    t.deepEquals(actual1, [expected[1]], `all ${level} messages should have been returned`);
    t.deepEquals(actual2, [`${level} message 2`], `all ${level} messages should have been returned`);

    actual1.push(`${level} message 3`);
    actual1[0] = `new ${level} message 1`;
    actual2.push(`${level} message 3`);
    actual2[0] = `new ${level} message 1`;

    t.deepEquals(rootLogger.getMessages(level, / 2$/), [expected[1]], `${level} messages should not be modified`);
    t.deepEquals(rootLogger[`get${_.capitalize(level)}Messages`](/ 2/), [`${level} message 2`]);

  });

  t.end();

});

test('0-parameter getMessages should return clone of entire object', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  const expected = {
    error: ['error message 1', 'error message 2'],
    warn: ['warn message 1', 'warn message 2'],
    info: ['info message 1', 'info message 2'],
    verbose: ['verbose message 1', 'verbose message 2'],
    debug: ['debug message 1', 'debug message 2'],
    silly: ['silly message 1', 'silly message 2'],
  };

  Object.keys(expected).forEach((level) => {
    expected[level].forEach((msg) => { logger[level](msg); });
  });

  const actual = rootLogger.getMessages();

  // log some more messages to show that getMessages returned a clone
  Object.keys(expected).forEach((level) => {
    logger[level](`${level} message 3`);
  });

  t.deepEquals(actual, expected);
  t.end();

});

test('unknown level parameter to getMessages should throw error', (t) => {
  const rootLogger = require('../index')();

  t.throws(
    rootLogger.getMessages.bind(null, 'unknown level'),
    /^unsupported log level: unknown level$/
  );
  t.end();

});


// TESTS FOR HAS
test('hasMessages should return true if there is at least 1 message at that level', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    t.notOk(rootLogger[`has${_.capitalize(level)}Messages`]());
    t.notOk(rootLogger.hasMessages(level));

    logger[level](`${level} message`);

    t.ok(rootLogger[`has${_.capitalize(level)}Messages`]());
    t.ok(rootLogger.hasMessages(level));

  });

  t.end();

});

test('hasMessages with pattern should return true if there is at least 1 message at that level', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    // add a message that won't match the pattern
    logger[level](`${level} message 1`);

    t.notOk(rootLogger.hasMessages(level, / 2$/), `should not be any messages matching pattern at ${level} level`);
    t.notOk(rootLogger[`has${_.capitalize(level)}Messages`](/ 2/), `should not be any messages matching pattern at ${level} level`);

    // add a message that matches the pattern
    logger[level](`${level} message 2`);

    t.ok(rootLogger.hasMessages(level, / 2$/), `should be messages matching pattern at ${level} level`);
    t.ok(rootLogger[`has${_.capitalize(level)}Messages`](/ 2/), `should be messages matching pattern at ${level} level`);

  });

  t.end();

});

test('unknown level parameter to hasMessages should throw error', (t) => {
  const rootLogger = require('../index')();

  t.throws(
    rootLogger.hasMessages.bind(null, 'unknown level'),
    /^unsupported log level: unknown level$/
  );
  t.end();

});


// TESTS FOR IS
test('isMessage should return true if a message matching the pattern has been logged', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    logger[level](`${level} message 1`);
    logger[level](`${level} message 2`);

    t.ok(rootLogger.isMessage(level, / 1$/));
    t.ok(rootLogger.isMessage(level, / 2$/));

    t.ok(rootLogger[`is${_.capitalize(level)}Message`](/ 1$/));
    t.ok(rootLogger[`is${_.capitalize(level)}Message`](/ 2$/));

    t.notOk(rootLogger.isMessage(level, / 3$/));
    t.notOk(rootLogger[`is${_.capitalize(level)}Message`](/ 3$/));

  });

  t.end();

});

test('isMessage should return true if a message equal to the supplied string has been logged', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    logger[level](`${level} message 1`);
    logger[level](`${level} message 2`);

    t.ok(rootLogger.isMessage(level, `${level} message 1`));
    t.ok(rootLogger.isMessage(level, `${level} message 2`));

    t.ok(rootLogger[`is${_.capitalize(level)}Message`](`${level} message 1`));
    t.ok(rootLogger[`is${_.capitalize(level)}Message`](`${level} message 2`));

    t.notOk(rootLogger.isMessage(level, `${level} message 3`));
    t.notOk(rootLogger[`is${_.capitalize(level)}Message`](`${level} message 3`));

  });

  t.end();

});

test('isMessage should throw an error if the supplied pattern is not a valid regexp or string', (t) => {
  const rootLogger = require('../index')();
  const logger = rootLogger.get('layer value');

  rootLogger.getLevels().forEach((level) => {
    t.throws(
      rootLogger.isMessage.bind(null, level, 17.3),
      /^pattern must be a regexp or string$/
    );
    t.throws(
      rootLogger[`is${_.capitalize(level)}Message`].bind(null, 17.3),
      /^pattern must be a regexp or string$/
    );
  });

  t.end();

});

test('unknown level parameter to isMessage should throw error', (t) => {
  const rootLogger = require('../index')();

  t.throws(
    rootLogger.isMessage.bind(null, 'unknown level'),
    /^unsupported log level: unknown level$/
  );
  t.end();

});
