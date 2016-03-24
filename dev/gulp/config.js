/*jshint camelcase: false */

/**
 * Configuration
 */

// paths
exports.paths = {};
exports.paths.root = __dirname + '/../..';
exports.paths.gulp = exports.paths.root + '/dev/gulp';
exports.paths.www_site = exports.paths.root + '/app';
exports.paths.peace = exports.paths.root + '/peace';
exports.paths.peace_dest = exports.paths.root + '/dist';
exports.paths.src = exports.paths.root + '/src';
exports.paths.build = exports.paths.root + '/build';
exports.paths.npm = exports.paths.root + '/node_modules';

exports.defaultLang = 'en';
exports.build = {};
exports.build.less_concat = exports.paths.build + '/styles/_styles.less';

// url for local development
exports.local_url = 'http://localhost:10001/';
