
'use strict';

var FileStreamRotator 	= require('file-stream-rotator'),
	fs 						= require('fs'),
	morgan 					= require('morgan'),
	moment 					= require('moment'),
	extend 					= require('extend'),

	defaults = {
		format: 'combined',
		logDirectory: './logs'
	};

// setup the logger
module.exports = function(options) {

	var settings = options;
	if (typeof options === 'string'){
		settings = {
			format: options
		}
	}

	settings = extend(true, defaults, settings);

	// ensure log directory exists
	fs.existsSync(settings.logDirectory) || fs.mkdirSync(settings.logDirectory)

	morgan.token('remote-addr', function(req, res) {
		return req.headers['x-forwarded-for'] || req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
	});

	morgan.token('date', function(req, res) {
		// %d/%b/%Y:%H:%M:%S %z
		return moment().format('DD/MMM/YYYY:HH:mm:ss ZZ');
	});

	// create a rotating write stream
	var accessLogStream = FileStreamRotator.getStream({
		filename: settings.logDirectory + '/access-%DATE%.log',
		frequency: 'daily',
		verbose: false,
		date_format: "YYYY-MM-DD"
	});

	return morgan(settings.format, {
		stream: accessLogStream,
		skip: function(req, res) {
			//Don't log Nagios requests
			return req.headers['user-agent'] && req.headers['user-agent'].indexOf('nagios-plugins') > -1 && req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].indexOf('10.') == 0;
		}
	});

};
