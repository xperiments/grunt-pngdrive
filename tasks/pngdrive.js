/*
 * grunt-pngdrive
 * https://github.com/xperiments/grunt-pngdrive
 *
 * Copyright (c) 2014 Pedro Casaubon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var fs = require('fs');
	var path = require('path');
	var Canvas = require('canvas');
	var pngdrive = require('./PNGDriveTS').pngdrive;
	var PNGDrive = pngdrive.PNGDrive;
	var execFile = require('child_process').execFile;
	var optipng = require('optipng-bin').path;

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	var extensionMap = {
		'js': 'text/javascript', 'css': 'text/css', 'json': 'application/json', 'xml': 'application/xml', 'html': 'text/html', 'svg': 'image/svg+xml'
	}

	function getExtension(filename) {
		var ext = path.extname(filename || '').split('.');
		return ext[ext.length - 1];
	}

	function getMimeForFile(filename) {
		return extensionMap[ getExtension(filename).toLowerCase() ];

	}

	grunt.registerMultiTask('grunt-pngdrive', 'The best Grunt plugin ever.', function () {

		var done = this.async();
		var todo = this.files.length;
		this.files.forEach(function (config, fileID) {

			var drive = new PNGDrive();
			config.src.forEach(function (file) {
				console.log('Adding file:', file);
				drive.addTextFile(grunt.file.read(file), path.basename(file), getMimeForFile(file));
			});

			drive.encode(function () {
				var canvas = this.createImage();
				var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
				if (fs.existsSync(config.output)) {
					fs.unlinkSync(config.output);
				}
				if (fs.existsSync(config.output + '___')) {
					fs.unlinkSync(config.output + '___');
				}
				fs.writeFileSync(config.output + '___', base64Data, 'base64');
			});

			execFile(optipng, ['-o', '6', '-out', config.output, config.output + '___'], function (err) {
				if (err) {
					throw err;
				}
				fs.unlinkSync(config.output + '___');
				console.log('Image minified!');
				if (todo == fileID) {
					done();
				}
			});
		});
	});

};
